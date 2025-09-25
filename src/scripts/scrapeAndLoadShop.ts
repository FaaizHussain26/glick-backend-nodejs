import { embedProducts } from "../services/scrape.service";
import { pineconeShopIndex } from "../config/pinecone";
import { scrapeShopProducts } from "../services/scrape.service";

(async () => {
  const products = await scrapeShopProducts();
  const vectors = await embedProducts(products);
  await pineconeShopIndex.upsert(vectors.map(v => ({ id: v.id, values: v.embedding, metadata: v.metadata })));
  console.log(`Uploaded ${vectors.length} product vectors into Pinecone.`);
})();
