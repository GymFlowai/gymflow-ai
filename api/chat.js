export default async function handler(req, res) {
  const { message } = req.body;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await openaiRes.json();

    if (!data.choices || !data.choices[0]) {
      return res.status(200).json({ reply: "No response from AI." });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
