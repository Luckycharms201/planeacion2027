/**
 * Ensambla PNGs en un PDF de una página por imagen, sin dependencias.
 *
 * Cada PNG se descomprime, se le quita el filtro por scanline y el canal
 * alfa, y se vuelve a comprimir como imagen /FlateDecode dentro del PDF:
 * el resultado es sin pérdida (nada de recompresión JPEG sobre el texto).
 * Las páginas miden 960×540 pt — el 16:9 estándar de una presentación.
 */
import zlib from "node:zlib";
import { readFile } from "node:fs/promises";

const PAGE_W = 960;
const PAGE_H = 540;

/** Lee los chunks de un PNG y devuelve { width, height, rgb } (8 bits/canal). */
function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("no es un PNG");

  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat = [];

  let off = 8;
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      if (data[12] !== 0) throw new Error("PNG entrelazado no soportado");
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
    off += len + 12;
  }

  if (bitDepth !== 8 || (colorType !== 2 && colorType !== 6)) {
    throw new Error(`PNG no soportado (bitDepth ${bitDepth}, color ${colorType})`);
  }

  const channels = colorType === 6 ? 4 : 3;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.allocUnsafe(width * height * 3);

  // deshace los filtros PNG (spec 9.2) línea a línea
  const prev = Buffer.alloc(stride);
  const cur = Buffer.allocUnsafe(stride);
  let src = 0;
  let dst = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[src++];
    raw.copy(cur, 0, src, src + stride);
    src += stride;
    for (let i = 0; i < stride; i++) {
      const a = i >= channels ? cur[i - channels] : 0; // izquierda
      const b = prev[i]; // arriba
      const c = i >= channels ? prev[i - channels] : 0; // diagonal
      let v = cur[i];
      switch (filter) {
        case 0:
          break;
        case 1:
          v += a;
          break;
        case 2:
          v += b;
          break;
        case 3:
          v += (a + b) >> 1;
          break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a);
          const pb = Math.abs(p - b);
          const pc = Math.abs(p - c);
          v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
          break;
        }
        default:
          throw new Error(`filtro PNG desconocido: ${filter}`);
      }
      cur[i] = v & 0xff;
    }
    // descarta alfa: las capturas son opacas
    for (let x = 0; x < width; x++) {
      const s = x * channels;
      out[dst++] = cur[s];
      out[dst++] = cur[s + 1];
      out[dst++] = cur[s + 2];
    }
    cur.copy(prev);
  }

  return { width, height, rgb: out };
}

/** Construye el PDF a partir de una lista de rutas PNG (en orden de página). */
export async function buildPdf(files) {
  const images = [];
  for (const file of files) {
    const { width, height, rgb } = decodePng(await readFile(file));
    images.push({
      width,
      height,
      data: zlib.deflateSync(rgb, { level: 9 }),
    });
  }

  const chunks = [];
  const offsets = [0]; // objeto 0 es el libre
  let length = 0;
  const push = (buf) => {
    const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf, "latin1");
    chunks.push(b);
    length += b.length;
  };
  const addObject = (num, body, stream) => {
    offsets[num] = length;
    push(`${num} 0 obj\n${body}\n`);
    if (stream) {
      push("stream\n");
      push(stream);
      push("\nendstream\n");
    }
    push("endobj\n");
  };

  // 1 catálogo · 2 páginas · luego, por slide: página, contenido, imagen
  const pageIds = images.map((_, i) => 3 + i * 3);

  push("%PDF-1.7\n%\xE2\xE3\xCF\xD3\n");
  addObject(1, "<< /Type /Catalog /Pages 2 0 R >>");
  addObject(
    2,
    `<< /Type /Pages /Count ${images.length} /Kids [${pageIds
      .map((id) => `${id} 0 R`)
      .join(" ")}] >>`
  );

  images.forEach((img, i) => {
    const pageId = pageIds[i];
    const contentId = pageId + 1;
    const imageId = pageId + 2;
    const content = `q\n${PAGE_W} 0 0 ${PAGE_H} 0 0 cm\n/Im0 Do\nQ`;

    addObject(
      pageId,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
        `/Resources << /XObject << /Im0 ${imageId} 0 R >> >> ` +
        `/Contents ${contentId} 0 R >>`
    );
    addObject(
      contentId,
      `<< /Length ${content.length} >>`,
      Buffer.from(content, "latin1")
    );
    addObject(
      imageId,
      `<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} ` +
        `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode ` +
        `/Length ${img.data.length} >>`,
      img.data
    );
  });

  const total = 3 + images.length * 3;
  const xrefStart = length;
  let xref = `xref\n0 ${total}\n0000000000 65535 f \n`;
  for (let i = 1; i < total; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  push(xref);
  push(
    `trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`
  );

  return Buffer.concat(chunks);
}
