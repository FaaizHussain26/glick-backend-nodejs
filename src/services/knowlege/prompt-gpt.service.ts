import openai from "../../config/openai";

export async function generatePrompt(extractedText: string) {
  const systemPrompt = `
You are an AI assistant that generates structured, context-rich prompts for chatbots.
You will receive raw text content from a document.
Your job is to transform it into a single coherent prompt that a chatbot can use as knowledge context.
Make it concise but comprehensive, keeping only relevant information.
`;
  const userPrompt = `

Content:
${extractedText}
Instruction:
Create one single, clean, plain-text prompt that summarizes and organizes the key information
in a way suitable for chatbot retrieval or fine-tuning.
`;

  const resp = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 1200,
    temperature: 0.3,
  });

  const content = resp.choices[0]?.message?.content || "";
  if (!content) throw new Error("No prompt generated from GPT.");

  return content;
}
