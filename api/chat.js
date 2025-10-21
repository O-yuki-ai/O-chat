export default async function handler(req, res) {
  // リクエストの本文を取得
  const { message } = await req.body;

  // Gemini API のエンドポイント
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY;

  // APIに送るデータ
  const data = {
    contents: [{ role: "user", parts: [{ text: message || "こんにちは" }] }]
  };

  try {
    // Gemini API にリクエスト
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || "（Oちゃんがちょっと考え中みたい…）";

    // レスポンスを返す
    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "エラーが発生しました" });
  }
}
