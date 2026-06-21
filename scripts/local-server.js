const fs = require("fs");
const http = require("http");
const path = require("path");
const chatHandler = require("../api/chat");

const root = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 8787);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function sendFile(res, filePath) {
  fs.readFile(filePath, function (error, content) {
    if (error) {
      res.statusCode = error.code === "ENOENT" ? 404 : 500;
      res.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", contentTypes[path.extname(filePath)] || "application/octet-stream");
    res.end(content);
  });
}

const server = http.createServer(function (req, res) {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/api/chat") {
    chatHandler(req, res);
    return;
  }

  const cleanPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(root, cleanPath));

  if (!filePath.startsWith(root)) {
    res.statusCode = 403;
    res.end("Forbidden");
    return;
  }

  sendFile(res, filePath);
});

server.listen(port, function () {
  console.log("Local server running at http://127.0.0.1:" + port);
});
