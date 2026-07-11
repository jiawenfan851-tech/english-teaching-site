import { createServer } from "node:http";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdarqzkb";
const REQUIRED_FIELDS = ["学生姓名", "家长姓名", "学生年级", "学习目标", "微信号", "希望试听日期", "希望试听时间段"];

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(data));
}

function cleanFields(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => typeof key === "string" && key.length <= 40)
      .map(([key, fieldValue]) => [key, String(fieldValue ?? "").trim().slice(0, 1200)])
  );
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 20_000) reject(new Error("payload_too_large"));
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  if (req.method !== "POST") {
    sendJson(res, 405, { ok: false, message: "Method not allowed" });
    return;
  }

  try {
    const body = JSON.parse(await readBody(req));
    const fields = cleanFields(body?.fields);
    if (fields._gotcha) {
      sendJson(res, 200, { ok: true });
      return;
    }

    const missing = REQUIRED_FIELDS.filter((field) => !fields[field]);
    if (missing.length) {
      sendJson(res, 400, { ok: false, message: `请填写：${missing.join("、")}` });
      return;
    }

    const upstream = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...fields,
        subject: "新的英语课程预约",
        预约详情: String(body?.details || "").slice(0, 6000),
        提交来源: "Bright English 腾讯云国内预约接口",
        服务器接收时间: new Date().toISOString()
      })
    });

    if (!upstream.ok) throw new Error(`delivery_failed_${upstream.status}`);
    sendJson(res, 200, { ok: true });
  } catch (error) {
    const status = error.message === "payload_too_large" ? 413 : 500;
    console.error("Booking request failed", error);
    sendJson(res, status, { ok: false, message: status === 413 ? "提交内容过长" : "预约提交失败" });
  }
});

server.listen(9000, "0.0.0.0", () => {
  console.log("Bright English booking function listening on port 9000");
});
