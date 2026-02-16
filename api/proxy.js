/**
 * Vercel Serverless Proxy — 轉發到 Google Apps Script，並加上 CORS 標頭以解決瀏覽器 CORS 錯誤
 * 前端改為呼叫 /api/proxy（同源），由本 API 轉發到 GOOGLE_SCRIPT_URL
 *
 * 環境變數：在 Vercel 專案設定中新增 GOOGLE_SCRIPT_URL = 你的 Web App 網址
 */

export default async function handler(req, res) {
  // 預檢請求
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({
      status: 'error',
      message: 'GOOGLE_SCRIPT_URL is not configured on the server.',
    });
  }

  try {
    if (req.method === 'GET') {
      const { action } = req.query || {};
      const url = action ? `${scriptUrl.replace(/\?.*$/, '')}?action=${encodeURIComponent(action)}` : scriptUrl;
      const r = await fetch(url, { method: 'GET' });
      const text = await r.text();
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json');
      return res.status(r.status).send(text);
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
      const r = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const text = await r.text();
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json');
      return res.status(r.status).send(text);
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({
      status: 'error',
      message: e.message || 'Proxy request failed',
    });
  }
}
