import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import worker, { CallingCards } from "./cloudflare/rsvp-worker.js";

const port = Number(process.argv[2] ?? 8000);
// Ordinary previews use the published ballot. Explicit DB paths isolate tests.
const dbPath = process.env.BACHELOR_PARTY_PREVIEW_DB;
if (dbPath) mkdirSync(dirname(dbPath), { recursive: true });
const db = dbPath ? new DatabaseSync(dbPath) : null;
const ballotBox = db && new CallingCards({
  storage: {
    sql: {
      exec(statement, ...params) {
        const rows = db.prepare(statement).all(...params);
        return { toArray: () => rows };
      },
    },
  },
});
const bindings = {
  CALLING_CARDS: {
    getByName: () => ({ fetch: (url, init) => ballotBox.fetch(new Request(url, init)) }),
  },
};

const types = {
  "/index.html": "text/html; charset=utf-8",
  "/bachelor-party.css": "text/css; charset=utf-8",
  "/bachelor-party-config.js": "text/javascript; charset=utf-8",
  "/bachelor-party.js": "text/javascript; charset=utf-8",
  "/calling-cards.js": "text/javascript; charset=utf-8",
  "/assets/tavern-hero.webp": "image/webp",
};
const venuePhoto = /^\/assets\/venues\/[a-z0-9-]+\.webp$/;

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://" + request.headers.host);
    if (!["localhost", "127.0.0.1"].includes(url.hostname)) {
      response.writeHead(403).end();
      return;
    }

    if (url.pathname === "/api/calling-cards") {
      if (request.headers.origin && request.headers.origin !== url.origin) {
        response.writeHead(403).end();
        return;
      }
      const incoming = new Request(url, {
        method: request.method,
        headers: request.headers,
        ...(request.method === "POST" && { body: request, duplex: "half" }),
      });
      const result = db
        ? await worker.fetch(incoming, bindings)
        : await fetch(new Request(new URL(url.search, "https://bachelor-party-rsvp.codygardi22.workers.dev/"), incoming), {
          signal: AbortSignal.timeout(10000),
        });
      const headers = new Headers(result.headers);
      // fetch decodes the upstream body; let this server frame the plain text.
      for (const name of ["content-encoding", "content-length", "transfer-encoding"]) headers.delete(name);
      response.writeHead(result.status, Object.fromEntries(headers));
      response.end(await result.text());
      return;
    }

    const file = url.pathname === "/" ? "/index.html" : url.pathname;
    const contentType = Object.hasOwn(types, file) ? types[file] : venuePhoto.test(file) ? "image/webp" : "";
    if (!contentType) {
      response.writeHead(404).end();
      return;
    }
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }

    const content = await readFile(new URL("." + file, import.meta.url));
    response.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-store" });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch (error) {
    if (error.code === "ENOENT") {
      response.writeHead(404).end();
      return;
    }
    console.error(error.message);
    response.writeHead(500).end("Local preview error.");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log("Bachelor Quest preview at http://127.0.0.1:" + server.address().port + "/");
});
