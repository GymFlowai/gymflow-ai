// /api/chat.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key is missing in environment variables' });
  }

  try {
    const response = await fetch('api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userInput })
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        temperature: 0.7
    });

    const data = await response.json();
    const reply =data.reply;

    // Now display the reply in your chat bubble
    addMessageToChat('GymFlow AI', reply);

    if (!openaiRes.ok) {
      return res.status(500).json({ error: 'OpenAI error', details: data });
    }

    if (data.choices && data.choices.length > 0) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      return res.status(500).json({ error: 'Unexpected OpenAI response structure', details: data });
    }

  } catch (err) {
    return res.status(500).json({ error: 'Unhandled server error', message: err.message });
  }
}
