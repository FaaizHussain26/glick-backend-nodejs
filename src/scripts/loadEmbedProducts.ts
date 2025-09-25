import { loadAndEmbedFaqs } from "../services/pinecone.service";

(async () => {
  try {
    await loadAndEmbedFaqs();
    console.log("Faqs embedded successfully.");
  } catch (err) {
    console.error("Error embedding posts:", err);
  }
})();
