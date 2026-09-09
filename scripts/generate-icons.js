import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG Icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="pulse" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#818cf8" />
      <stop offset="100%" stop-color="#c084fc" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="110" fill="url(#bg)" />
  <path d="M 64,320 L 140,320 L 180,210 L 230,370 L 290,160 L 350,260 L 390,140 L 448,140"
        fill="none" stroke="url(#pulse)" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="390" cy="140" r="16" fill="#38bdf8" />
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgContent, 'utf-8');

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);

  let crc = 0xffffffff;
  for (let i = 4; i < 8 + len; i++) {
    const byte = buf[i];
    crc ^= byte;
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  crc = (crc ^ 0xffffffff) >>> 0;
  buf.writeUInt32BE(crc, 8 + len);

  return buf;
}

function createMinimalPNG(width, height) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const ihdrChunk = createChunk('IHDR', ihdr);

  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const isPulse = (y > height * 0.4 && y < height * 0.6) && (Math.abs(y - (height * 0.5 - Math.sin(x / width * Math.PI * 2) * (height * 0.1))) < height * 0.05);
      
      if (isPulse) {
        rawData[pxOffset] = 56;
        rawData[pxOffset + 1] = 189;
        rawData[pxOffset + 2] = 248;
        rawData[pxOffset + 3] = 255;
      } else {
        rawData[pxOffset] = 15;
        rawData[pxOffset + 1] = 23;
        rawData[pxOffset + 2] = 42;
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const zlibHeader = Buffer.from([0x78, 0x01]);
  const blocks = [];
  const maxBlockSize = 65535;
  let offset = 0;

  while (offset < rawData.length) {
    const end = Math.min(offset + maxBlockSize, rawData.length);
    const isLast = (end === rawData.length) ? 1 : 0;
    const blockLen = end - offset;
    const header = Buffer.alloc(5);
    header[0] = isLast;
    header.writeUInt16LE(blockLen, 1);
    header.writeUInt16LE(blockLen ^ 0xffff, 3);
    blocks.push(header, rawData.subarray(offset, end));
    offset = end;
  }

  let a = 1, b = 0;
  for (let i = 0; i < rawData.length; i++) {
    a = (a + rawData[i]) % 65521;
    b = (b + a) % 65521;
  }
  const adlerVal = ((b * 65536) + a) >>> 0;
  const adler32 = Buffer.alloc(4);
  adler32.writeUInt32BE(adlerVal, 0);

  const idatData = Buffer.concat([zlibHeader, ...blocks, adler32]);
  const idatChunk = createChunk('IDAT', idatData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createMinimalPNG(192, 192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createMinimalPNG(512, 512));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), createMinimalPNG(512, 512));

console.log('Successfully generated PWA icons in /public/icons/');
