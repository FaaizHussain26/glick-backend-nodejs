import openai from "../config/openai";
import { pineconeIndex } from "../config/pinecone";

const faqs = [
  {
    id: 1,
    q: "When can you work on my roof?",
    a: "Our coordinators assign crews based on location and urgency. I’ll collect your address, roof type, and current issues, then we’ll confirm the earliest slot."
  },
  {
    id: 2,
    q: "What system do you use?",
    a: "We service single-ply (EPDM, TPO, PVC), metal, mod-bit, built-up, restoration/coating systems and other popular roofing systems. We’ll recommend the best option after inspection."
  },
  
];

export const loadAndEmbedFaqs = async () => {
  const existingIds = new Set<string>();
  const vectorData: any[] = [];

  for (const faq of faqs) {
    const id = `faq-${faq.id}`;
    if (existingIds.has(id)) continue;
    existingIds.add(id);

    const content = `Q: ${faq.q}\nA: ${faq.a}`;

    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: content,
    });

    vectorData.push({
      id,
      values: embedding.data[0].embedding,
      metadata: {
        question: faq.q,
        answer: faq.a,
        content,
      },
    });
  }

  if (vectorData.length > 0) {
    await pineconeIndex.upsert(vectorData);
    console.log(`✅ Upserted ${vectorData.length} FAQs into Pinecone`);
  }
};
