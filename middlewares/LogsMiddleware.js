const fs = require("fs");
const path = require("path");

function logMiddleware(req, res, next) {
  const startTime = Date.now();

  res.on("finish", () => {
    const executionTime = Date.now() - startTime;
    const headers = JSON.stringify(req.headers);
    const body =
      Object.keys(req.body || {}).length > 0
        ? JSON.stringify(req.body)
        : "N/A";
    const referer = req.headers.referer || "N/A";

    const log = `${new Date().toISOString()} - ${req.method} - ${req.originalUrl
      } - ${req.ip} - Referer: ${referer} - Status: ${res.statusCode
      } - Execution Time: ${executionTime} ms
Headers: ${headers}
Body: ${body}
------------------------------------------------------
`;

    const logsDirectory = path.join(__dirname, "..", "logs");
    const logFilePath = path.join(logsDirectory, "doc.log");

    if (!fs.existsSync(logsDirectory)) {
      fs.mkdirSync(logsDirectory);
    }

    fs.appendFile(logFilePath, log, (err) => {
      if (err) console.error("Erreur log:", err);
    });
  });

  next();
}

module.exports = logMiddleware;