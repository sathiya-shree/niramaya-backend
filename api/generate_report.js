export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { diary } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: diary }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const report =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No insights generated.";

    return res.status(200).json({ report });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "AI generation failed" });
  }
}
