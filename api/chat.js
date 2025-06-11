export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

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

    console.log("OpenAI response:", data);

Thanks — here is your **full and correct `/api/chat.js` code**, ready for production on Vercel using an `sk-proj-...` OpenAI key:

---

## ✅ `/api/chat.js` — Clean, Secure, Working Version

```js
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract message from request
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    // Send request to OpenAI Chat API
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: message
          }
        ],
      }),
    });

    const data = await openaiRes.json();

    // Debug logging (optional — remove in production)
    console.log("OpenAI response:", data);

    if (!data.choices || !data.choices[0]) {
      return res.status(200).json({ reply: "No response from AI." });
    }

    // Return the AI's message
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ reply: "Server error. Please try again later." });
  }
}
