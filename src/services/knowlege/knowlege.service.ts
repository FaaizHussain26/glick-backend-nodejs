import fs from "fs/promises";
import { extractText } from "./extract.service";

import { Knowledge } from "../../database/models/knowlodge";
import { generatePrompt } from "./prompt-gpt.service";

export class KnowledgeService {
  static async createKnowledge(
    title: string,
    chatbotId: string,
    file: Express.Multer.File
  ) {
    const knowledge = await Knowledge.create({
      title,
      chatbotId,
      extractionStatus: "pending",
      originalFileName: file.originalname,
    });

    try {
      const text = await extractText(file.path, file.originalname);
      const prompt = await generatePrompt(text);

      knowledge.promptContent = prompt;
      knowledge.extractionStatus = "succeeded";
      await knowledge.save();

      await fs.unlink(file.path).catch(() => {});
      return { knowledge };
    } catch (err) {
      knowledge.extractionStatus = "failed";
      knowledge.originalFilePath = file.path;
      await knowledge.save();
      return { knowledge, error: (err as Error).message };
    }
  }

  static async getAll() {
    return Knowledge.find().sort({ createdAt: -1 });
  }

  static async getById(id: string) {
    return Knowledge.findById(id);
  }

  static async updateKnowledge(
    id: string,
    updates: Partial<{
      title: string;
      chatbotId: string;
      file?: Express.Multer.File;
    }>
  ) {
    const knowledge = await Knowledge.findById(id);
    if (!knowledge) throw new Error("Knowledge not found");


    if (updates.title) knowledge.title = updates.title;
    if (updates.chatbotId) knowledge.chatbotId = updates.chatbotId;


    if (updates.file) {
      try {
        const extractedText = await extractText(
          updates.file.path,
          updates.file.originalname
        );
        const prompt = await generatePrompt(extractedText);

        knowledge.promptContent = prompt;
        knowledge.extractionStatus = "succeeded";

        // delete file after success
        await fs.unlink(updates.file.path).catch(() => {});
      } catch (error) {
        knowledge.extractionStatus = "failed";
        knowledge.originalFilePath = updates.file.path;
        knowledge.originalFileName = updates.file.originalname;
        console.error("Error re-extracting:", error);
      }
    }

    await knowledge.save();
    return knowledge;
  }

  static async deleteKnowledge(id: string) {
    const knowledge = await Knowledge.findById(id);
    if (!knowledge) throw new Error("Knowledge not found");

    // if there's an unprocessed file, remove it from disk
    if (knowledge.originalFilePath) {
      await fs.unlink(knowledge.originalFilePath).catch(() => {});
    }

    await knowledge.deleteOne();
    return true;
  }


}
