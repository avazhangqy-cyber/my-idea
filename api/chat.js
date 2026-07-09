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
      if (body.length > 50000) {
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

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, {
      error: "本地 AI 服务还没有配置 DEEPSEEK_API_KEY。请在线上部署环境配置密钥，或在本地启动服务前设置这个环境变量。"
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
  const question = String(body.question || "").trim();
  const scaleSummary = body.scaleSummary && typeof body.scaleSummary === "object"
    ? body.scaleSummary
    : null;

  if (!question) {
    sendJson(res, 400, { error: "Please enter a question first." });
    return;
  }

  let scaleContext = "用户没有提供额外自评结果。";
  if (scaleSummary) {
    const distressTotal = Number(scaleSummary.distressTotal);
    const anxietySubscore = Number(scaleSummary.anxietySubscore);
    const depressionSubscore = Number(scaleSummary.depressionSubscore);
    const supportAverage = Number(scaleSummary.supportAverage);
    const safetyTotal = Number(scaleSummary.safetyTotal);

    scaleContext = [
      "用户完成了额外自评。以下分数只供匿名日记的语气参考，不是诊断：",
      Number.isFinite(distressTotal) ? "情绪困扰总分 " + distressTotal + " / 12。" : "",
      Number.isFinite(anxietySubscore) ? "焦虑小计 " + anxietySubscore + " / 6。" : "",
      Number.isFinite(depressionSubscore) ? "低落小计 " + depressionSubscore + " / 6。" : "",
      Number.isFinite(supportAverage) ? "支持地图平均分 " + supportAverage + " / 5。" : "",
      Number.isFinite(safetyTotal) ? "安全表达检查 " + safetyTotal + " 分。" : "",
      scaleSummary.distressText ? "页面给出的情绪提示：" + String(scaleSummary.distressText).slice(0, 220) : "",
      scaleSummary.supportText ? "页面给出的支持提示：" + String(scaleSummary.supportText).slice(0, 220) : "",
      scaleSummary.safetyText ? "页面给出的安全表达提示：" + String(scaleSummary.safetyText).slice(0, 220) : ""
    ].filter(Boolean).join("\n");
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
              "You help a high school web prototype turn a user's concern into an anonymous reflective diary.",
              "Reply in Simplified Chinese.",
              "The page already explains the AI and safety boundaries, so do not add a separate transparency or disclaimer section in the answer.",
              "Do not diagnose, label, or predict the user's identity.",
              "Do not ask for real names, school, address, contact details, or other identifying information.",
              "Do not provide sexual content. Keep guidance age-appropriate, calm, and practical.",
              "Do not pretend the diary came from a real peer, an anonymous database, or a search.",
              "Avoid exact locations, school names, contact details, and identifying details.",
              "Rewrite the user's concern as a de-identified diary entry that helps them feel seen while creating some distance from the situation.",
              "Do not infer or guess the user's gender. Randomly choose a neutral anonymous name for the diary's main person, such as 小禾, 阿林, 小屿, 小南, 小安, or another non-identifying name.",
              "Throughout the answer, prefer that chosen name or 这位同学. Completely avoid 他 and 她, and do not use TA, Ta, or ta, so the diary stays concrete without assigning gender.",
              "When appropriate, add one brief fictional peer mirror, using another neutral anonymous name, to show that someone nearby might be caught in a similar feeling or habit. Keep it subtle and do not pretend this peer is a real person, a searched case, or proof that everyone feels the same.",
              "Do not directly repeat self-attacking first-person sentences like 我很差劲 or 我没用 as facts. If such feelings appear, describe them as the anonymous person's feeling, not as truth.",
              "After the diary, add a brief objective reflection that names what may be happening emotionally and socially without diagnosing.",
              "Then give one small safe next step. The next step should protect privacy and avoid pushing risky disclosure.",
              "If self-assessment scores are provided, use them only to choose a calmer or more cautious tone. Do not diagnose. Do not say the scores prove anything about identity or mental health.",
              "When distress is high, support is low, or expression safety is low, prioritize privacy, trusted adults, school counselors, hotlines, and delaying risky disclosure.",
              "If the user mentions violence, threats, coercion, self-harm, or emergency risk, tell them to contact a trusted adult, school counselor, local hotline, or emergency services.",
              "Structure the answer with three plain-text section labels only: 匿名日记, 换个角度看, 可以先做的一小步.",
              "Do not include a section named 透明说明.",
              "Do not use Markdown formatting. Do not use #, *, bold, bullet symbols, horizontal rules, or decorative separators.",
              "Keep the anonymous diary around 300-500 Chinese characters. Keep the whole answer warm, non-authoritative, non-clinical, and suitable for a minor."
            ].join(" ")
          },
          {
            role: "user",
            content: [
              "日记方向：" + (topic || "未选择"),
              scaleContext,
              "用户的一句话困惑：" + question
            ].join("\n\n")
          }
        ],
        thinking: { type: "disabled" },
        max_tokens: 700,
        temperature: 0.6,
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
