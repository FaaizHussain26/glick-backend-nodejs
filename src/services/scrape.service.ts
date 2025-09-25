import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { WORDPRESS_SITE } from "../config/environmentVariables";
import openai from "../config/openai";
import crypto from "crypto";


export interface ProductData {
  title: string;
  price: string;
  link: string;
  imageUrl: string;
}

export const scrapeShopProducts = async (): Promise<ProductData[]> => {
  const res = await fetch(`${WORDPRESS_SITE}/shop/`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const products: ProductData[] = [];

  $(".product").each((_, el) => {
    const title = $(el).find(".woocommerce-loop-product__title").text().trim();
    const price = $(el).find(".price").text().trim();
    const link = $(el).find("a").attr("href") || "";
    const imageUrl = $(el).find("img").attr("src") || "";

    products.push({ title, price, link, imageUrl });
  });   

  return products;
};


export interface ProductVector {
  id: string;
  embedding: number[];
  metadata: {
    title: string;
    price: string;
    link: string;
    imageUrl: string;
  };
}

export const embedProducts = async (products: ProductData[]): Promise<ProductVector[]> => {
  const vectors: ProductVector[] = [];

  for (const p of products) {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: `${p.title} ${p.price}`,
    });

    const cleanedTitle = p.title
      .replace(/[^\x00-\x7F]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-]/g, "")
      .toLowerCase()
      .slice(0, 50);

    const shortHash = crypto.createHash("md5").update(p.title).digest("hex").slice(0, 6);
    const id = `product-${cleanedTitle}-${shortHash}`;

    vectors.push({
      id,
      embedding: response.data[0].embedding,
      metadata: {
        title: p.title,
        price: p.price,
        link: p.link,
        imageUrl: p.imageUrl,
      },
    });
  }

  return vectors;
};
