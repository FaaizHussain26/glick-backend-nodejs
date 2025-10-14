import { Schema, model, Document } from "mongoose";

export interface IChatbot extends Document {
  title: string;
  subTitle: string;
  firstMessage?: string;
  colorCode: string;
  imagePath?: String;
  createdAt: Date;
  updatedAt: Date;
}

const chatbotSchema = new Schema<IChatbot>(
  {
    title: { type: String, required: true },
    subTitle: { type: String, required: true },
    firstMessage: { type: String, required: false },
    colorCode: { type: String, required: true },
    imagePath: { type: String, required: false },
  },
  { timestamps: true }
);

export const chatbot = model<IChatbot>("chatbot", chatbotSchema);
