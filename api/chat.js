export default async function handler(req, res) {
  try {
    const body = req.body ? req.body : {};
    const message = body.message || "こんにちは";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const data = {
      contents: [{ role: "user", parts: [{ text: message }] }]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    const reply = result?.candidates?.[0]?.content?.parts?.[0]?.text || "Oちゃんが考え中みたい…";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
}
