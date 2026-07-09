const SUPABASE_URL = process.env.SUPABASE_URL || "https://cyzuhqzzebeabrueqfdp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_h0Zf1xqopABjfv10tNhuhA_jzn17qBy";
const https = require("https");

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    return JSON.parse(req.body || "{}");
  }

  return new Promise(function (resolve, reject) {
    let body = "";
    req.on("data", function (chunk) {
      body += chunk;
      if (body.length > 16000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", function () {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, data) {
  setCorsHeaders(res);
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function postToSupabase(record) {
  const url = new URL("/rest/v1/anonymous_stories", SUPABASE_URL);
  const body = JSON.stringify(record);

  return new Promise(function (resolve, reject) {
    const request = https.request({
      family: 4,
      hostname: url.hostname,
      method: "POST",
      path: url.pathname,
      port: 443,
      protocol: "https:",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: "Bearer " + SUPABASE_PUBLISHABLE_KEY,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        Prefer: "return=minimal"
      },
      timeout: 12000
    }, function (response) {
      let responseBody = "";
      response.setEncoding("utf8");
      response.on("data", function (chunk) {
        responseBody += chunk;
      });
      response.on("end", function () {
        resolve({
          ok: response.statusCode >= 200 && response.statusCode < 300,
          status: response.statusCode,
          body: responseBody
        });
      });
    });

    request.on("timeout", function () {
      request.destroy(new Error("Supabase request timed out."));
    });
    request.on("error", reject);
    request.write(body);
    request.end();
  });
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    setCorsHeaders(res);
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed." });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { error: "Invalid JSON body." });
    return;
  }

  const record = body && typeof body.record === "object" ? body.record : null;
  if (!record) {
    sendJson(res, 400, { error: "Missing record." });
    return;
  }

  const insertPayload = {
    topic: String(record.topic || "匿名记录").slice(0, 80),
    title: String(record.title || "匿名记录").slice(0, 120),
    body: String(record.body || "").slice(0, 12000),
    privacy_warnings: Array.isArray(record.privacy_warnings) ? record.privacy_warnings.slice(0, 12) : [],
    status: String(record.status || "pending_review").slice(0, 40)
  };

  try {
    const response = await postToSupabase(insertPayload);

    if (!response.ok) {
      sendJson(res, response.status || 500, {
        error: response.body || "Supabase insert failed."
      });
      return;
    }

    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 500, {
      error: "Could not reach Supabase from the server: " + error.message
    });
  }
};
