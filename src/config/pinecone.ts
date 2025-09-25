import { Pinecone } from "@pinecone-database/pinecone";

import { PINECONE_API_KEY, PINECONE_INDEX_NAME, PINECONE_INDEX_SHOP_NAME } from "./environmentVariables";

export const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY!,
});

export const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME! || "murphy-bed-products");


export const pineconeShopIndex = pinecone.Index(PINECONE_INDEX_SHOP_NAME! || "murphy-bed-shop");
