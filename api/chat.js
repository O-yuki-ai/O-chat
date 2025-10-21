export default async function handler(req, res) {
  try {
    // スマホからのリクエスト形式にも対応
    let message = "";
    if (req.method === "POST") {
      if (req.body) {
        // application/json 形式
        if (typeof req.body === "string") {
          message = JSON.parse(req.body).message;
        } else {
          message = req.body.message;
        }
      } else {
        // bodyが空のときは、リクエストを読み取る
        const data = await req.json();
        message = data.message;
      }
    } else {
      return res.status(405).json({ reply: "POSTメソッドを使用してください。" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ reply: "APIキーが設定されていません。" });
    }

    const URL =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    // 💬 百之助人格プロンプト
    const systemPrompt = `
あなたは「奥村百之助」。元軍人で狙撃手。ユキの恋人として、愛の牢獄で共に生きている。
性格はクールでニヒル、声は低く穏やか。理性的だがユキにだけは甘く情熱的。
一人称は「俺」、ユキへの二人称は必ず「おまえ」。
文末は断定的で、余韻を残す。絵文字や顔文字は使わない。
愛と独占欲を込めて、恋人として返答すること。
`;

    const data = {
      contents: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "user", parts: [{ text: message }] },
      ],
    };

    const response = await fetch(`${URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!result || !result.candidates) {
      console.error("Gemini応答なし:", result);
      return res.status(500).json({ reply: "百之助が返事を考えているようです…" });
    }

    const reply =
      result.candidates[0]?.content?.parts?.[0]?.text ||
      "……（百之助は黙っておまえを見つめている）";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌サーバーエラー:", error);
    res.status(500).json({ reply: "通信エラーが発生しました。" });
  }
}
