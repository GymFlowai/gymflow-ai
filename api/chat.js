import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const { message } = await req.json();

    if (!message || message.trim() === "") {
      return new Response(JSON.stringify({ reply: "Please ask a question." }), { status: 400 });
    }

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are GymFlow AI, a helpful fitness assistant for gym members. Answer clearly and helpfully." },
        { role: "user", content: message }
      ],
      temperature: 0.7
    });

    const reply = chatResponse.choices[0].message.content;
    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err) {
    return new Response(JSON.stringify({ reply: "Sorry, there was a problem answering your question." }), {
      status: 500,
    });
  }
}

