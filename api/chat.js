const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

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
      if (body.length > 12000) {
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
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed." });
    return;
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, {
      error: "The AI server is missing its API environment variable."
    });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { error: "Invalid JSON body." });
    return;
  }

  const topic = String(body.topic || "").slice(0, 60);
  const question = String(body.question || "").trim().slice(0, 800);

  if (!question) {
    sendJson(res, 400, { error: "Please enter a question first." });
    return;
  }

  try {
    const deepseekResponse = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        messages: [
          {
            role: "system",
            content: [
              "You are a supportive safety-planning helper for a high school web prototype.",
              "Reply in Simplified Chinese.",
              "Do not diagnose, label, or predict the user's identity.",
              "Do not ask for real names, school, address, contact details, or other identifying information.",
              "Do not provide sexual content. Keep guidance age-appropriate, calm, and practical.",
              "If the user mentions violence, threats, coercion, self-harm, or emergency risk, tell them to contact a trusted adult, school counselor, local hotline, or emergency services.",
              "Keep the answer short: empathy, one safety reminder, and 2-4 concrete next steps."
            ].join(" ")
          },
          {
            role: "user",
            content: "用户选择的困惑场景：" + (topic || "未选择") + "\n用户问题：" + question
          }
        ],
        thinking: { type: "disabled" },
        max_tokens: 450,
        temperature: 0.3,
        stream: false
      })
    });

    const data = await deepseekResponse.json();

    if (!deepseekResponse.ok) {
      sendJson(res, deepseekResponse.status, {
        error: data.error && data.error.message ? data.error.message : "DeepSeek request failed."
      });
      return;
    }

    const answer = data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content;

    sendJson(res, 200, {
      answer: answer || "DeepSeek returned an empty answer.",
      usage: data.usage || null
    });
  } catch (error) {
    sendJson(res, 500, { error: "Could not reach DeepSeek API." });
  }
};
