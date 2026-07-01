"use strict";
// Tiny local upload sink used only to pull recorded gameplay clips out of the
// preview browser (avoids passing megabytes of base64 through the tool-call
// context). Not part of the shipped game. Usage: node tools/upload-server.js [port] [outDir]
const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.argv[2]) || 8781;
const outDir = process.argv[3] || path.join(__dirname, "..", "_shots");
fs.mkdirSync(outDir, { recursive: true });

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  if (req.method === "POST" && req.url.startsWith("/upload")) {
    const url = new URL(req.url, `http://localhost:${port}`);
    const name = (url.searchParams.get("name") || "clip.webm").replace(/[^a-zA-Z0-9_.-]/g, "_");
    const filePath = path.join(outDir, name);
    const ws = fs.createWriteStream(filePath);
    req.pipe(ws);
    req.on("end", () => {
      console.log(`saved ${filePath} (${ws.bytesWritten} bytes)`);
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("ok");
    });
    req.on("error", (e) => {
      console.error("upload error", e);
      res.writeHead(500);
      res.end("error");
    });
    return;
  }
  res.writeHead(404);
  res.end();
});
server.listen(port, () => console.log(`upload sink listening on :${port}, writing to ${outDir}`));
