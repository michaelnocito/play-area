// Builds the social image for "Test the Verb, Not the Progress".
//
// ONE idea, drawn: the run with a bar under it stops where the bar stops.
// The same run with nothing under it keeps going off the page.
// No words in the frame — it has to survive the cover-the-words test.
//
//   node writing/build-verb-social.js
//
// Renders at 2x and downsamples, so the circles are smooth without a canvas lib.

const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const W = 1200, H = 630, SS = 2;              // SS = supersample factor
const w = W * SS, h = H * SS;

const hex = s => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
const BG = hex('#0b0b0d'), BLUE = hex('#38bdf8'), AMBER = hex('#fbbf24'), WALL = hex('#52525b');

// ── big RGB buffer ──────────────────────────────────────────────────────────
const buf = Buffer.alloc(w * h * 3);
for (let i = 0; i < w * h; i++) buf.set(BG, i * 3);

function blend(px, py, col, a) {
  if (a <= 0 || px < 0 || py < 0 || px >= w || py >= h) return;
  const o = (py * w + px) * 3;
  for (let k = 0; k < 3; k++) buf[o + k] = Math.round(buf[o + k] * (1 - a) + col[k] * a);
}
function disc(cx, cy, r, col, a) {
  for (let y = Math.floor(cy - r); y <= cy + r; y++)
    for (let x = Math.floor(cx - r); x <= cx + r; x++)
      if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) blend(x, y, col, a);
}
function bar(x0, y0, x1, y1, col, a = 1) {
  for (let y = Math.round(y0); y < y1; y++)
    for (let x = Math.round(x0); x < x1; x++) blend(x, y, col, a);
}
// Rounded ends, so the bar reads as a progress bar and not a rule.
function pill(x0, y0, x1, y1, col) {
  const r = (y1 - y0) / 2;
  bar(x0 + r, y0, x1 - r, y1, col);
  disc(x0 + r, y0 + r, r, col, 1);
  disc(x1 - r, y0 + r, r, col, 1);
}

// ── geometry (mirrors the canvas sketch) ────────────────────────────────────
const R = 15 * SS, GAP = 52 * SS, X0 = 120 * SS;
const N = 9, Y1 = 215 * SS, Y2 = 455 * SS;

for (let i = 0; i < N; i++) disc(X0 + i * GAP, Y1, R, BLUE, 1);

const bx = X0 - R - 8 * SS, bw = (N - 1) * GAP + 2 * R + 16 * SS;
pill(bx, Y1 + 52 * SS, bx + bw, Y1 + 74 * SS, AMBER);

// the wall the first run stops against
const wx = bx + bw + 46 * SS;
for (let y = Y1 - 96 * SS; y < Y1 + 130 * SS; y++)
  if (Math.floor((y - (Y1 - 96 * SS)) / (15 * SS)) % 2 === 0) bar(wx - 3 * SS, y, wx + 3 * SS, y + 1, WALL);

// the same run, nothing under it, running off the right edge
for (let i = 0, px = X0; px < w + R; px = X0 + ++i * GAP) {
  const over = px - (bx + bw);
  disc(px, Y2, R, BLUE, over <= 0 ? 1 : Math.max(0.14, 1 - over / (620 * SS)));
}

// ── downsample ──────────────────────────────────────────────────────────────
const out = Buffer.alloc(H * (W * 3 + 1));
for (let y = 0; y < H; y++) {
  out[y * (W * 3 + 1)] = 0;                    // PNG filter byte: none
  for (let x = 0; x < W; x++)
    for (let k = 0; k < 3; k++) {
      let s = 0;
      for (let dy = 0; dy < SS; dy++)
        for (let dx = 0; dx < SS; dx++) s += buf[((y * SS + dy) * w + x * SS + dx) * 3 + k];
      out[y * (W * 3 + 1) + 1 + x * 3 + k] = Math.round(s / (SS * SS));
    }
}

// ── PNG container ───────────────────────────────────────────────────────────
const crcTable = [...Array(256)].map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = b => {
  let c = 0xffffffff;
  for (const x of b) c = crcTable[(c ^ x) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc(body));
  return Buffer.concat([len, body, c]);
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;   // 8-bit truecolour

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(out, { level: 9 })),
  chunk('IEND', Buffer.alloc(0))
]);

const dest = path.join(__dirname, 'verb-forty-reps-1200x630.png');
fs.writeFileSync(dest, png);
console.log('wrote', dest, png.length, 'bytes');
