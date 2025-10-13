import { Schema, model, Document } from "mongoose";

export interface IKnowledge extends Document {
  title: string;
  chatbotId: string;
  promptContent?: string; // output from GPT
  extractionStatus: "pending" | "succeeded" | "failed";
  originalFilePath?: string; // path on disk if kept
  originalFileName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeSchema = new Schema<IKnowledge>(
  {
    title: { type: String, required: true },
    chatbotId: { type: String, required: true },
    promptContent: { type: String },
    extractionStatus: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      default: "pending",
    },
    originalFilePath: { type: String },
    originalFileName: { type: String },
  },
  { timestamps: true }
);

export const Knowledge = model<IKnowledge>("Knowledge", KnowledgeSchema);
