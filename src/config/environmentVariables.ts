import * as dotenv from "dotenv";
dotenv.config();

export const {
    PORT,
    OPEN_API_KEY,
    PINECONE_API_KEY,
    PINECONE_REGION,
    PINECONE_INDEX_NAME,
    PRODUCTS_ENDPOINT,
    WORDPRESS_SITE,
    PINECONE_INDEX_SHOP_NAME
} = process.env;