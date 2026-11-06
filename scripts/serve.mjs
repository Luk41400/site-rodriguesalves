import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";

const dist = new URL("../dist/", import.meta.url);
const port = Number(process.argv[2] || 4173);
const redirects = new Map([
  ["/index", "/"],
  ["/index.html", "/"],
  ["/privacidade.html", "/privacidade"],
  ["/privacidade/", "/privacidade"]
]);
const mime = {
  html: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  svg: "image/svg+xml",
  png: "image/png",
  woff2: "font/woff2",
  xml: "application/xml; charset=utf-8",
  txt: "text/plain; charset=utf-8"
};

try {
  await stat(new URL("index.html", dist));
} catch {
  console.error("Execute node scripts/build.mjs antes de iniciar a prévia.");
  process.exit(1);
}

createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }

  try {
    const { pathname: path, search } = new URL(request.url, "http://localhost");
    if (!/^\/(?:[\w.-]+\/)*[\w.-]*$/.test(path) || path.split("/").some(part => part === ".." || part === ".")) {
      response.writeHead(400).end();
      return;
    }
    if (redirects.has(path)) {
      response.writeHead(308, { Location: redirects.get(path) + search }).end();
      return;
    }
    const filename = path === "/" ? "index.html" : path === "/privacidade" ? "privacidade.html" : path.slice(1);
    const file = new URL(filename, dist);
    const info = await stat(file);
    if (!info.isFile()) {
      response.writeHead(404).end();
      return;
    }
    const extension = file.pathname.split(".").at(-1);
    response.writeHead(200, { "Content-Type": mime[extension] || "application/octet-stream", "Content-Length": info.size, "Cache-Control": "no-cache" });
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    createReadStream(file).on("error", () => response.destroy()).pipe(response);
  } catch {
    response.writeHead(404).end();
  }
}).listen(port, "127.0.0.1", () => console.log(`Prévia em http://127.0.0.1:${port}/`));
