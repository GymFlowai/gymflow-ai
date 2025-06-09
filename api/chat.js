// /api/chat.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const buffers = [];

    for await (const chunk of req) {
      buffers.push(chunk);
    }

    const rawBody = Buffer.concat(buffers).toString();
    const { message } = JSON.parse(rawBody);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Sorry, I had trouble answering that.';
    res.status(200).json({ reply });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Something went wrong with the AI.' });
  }
}
