import fs from "fs/promises";
import { chatbot } from "../database/models/chatbot";

export class ChatbotService {
  static async createChatbot(
    title: string,
    subTitle: string,
    colorCode: string,
    file: Express.Multer.File,
    firstMessage?: string
  ) {
    const newChatbot = await chatbot.create({
      title,
      subTitle,
      firstMessage,
      colorCode,
      imagePath: file.path,
    });

    try {
      await newChatbot.save();

      return { newChatbot };
    } catch (err) {
      // delete file if db save fails
      await fs.unlink(file.path).catch(() => {});
      return { error: (err as Error).message };
    }
  }

  static async getAll() {
    return chatbot.find().sort({ createdAt: -1 });
  }

  static async getById(id: string) {
    return chatbot.findById(id);
  }

  static async updateChatbot(
    id: string,
    updates: Partial<{
      title: string;
      subTitle: string;
      colorCode: string;
      file: Express.Multer.File;
      firstMessage?: string;
    }>
  ) {
    const existChatbot = await chatbot.findById(id);
    if (!existChatbot) throw new Error("chatbot not found");

    if (updates.title) existChatbot.title = updates.title;
    if (updates.subTitle) existChatbot.subTitle = updates.subTitle;
    if (updates.colorCode) existChatbot.colorCode = updates.colorCode;
    if (updates.firstMessage) existChatbot.firstMessage = updates.firstMessage;
    if (updates.file) {
        // delete old file
        if (existChatbot.imagePath) {
          await fs.unlink(existChatbot.imagePath.toString()).catch(() => {});
        }
        // set new file path
      existChatbot.imagePath = updates.file.path;
    }

    const updateChatbot = existChatbot;
    try {
      await updateChatbot.save();
    } catch (err) {
      // delete file if db save fails
      if (updates.file) {
        await fs.unlink(updates.file.path).catch(() => {});
      }
      return { error: (err as Error).message };
    }
    return updateChatbot;
  }

  static async deleteChatbot(id: string) {
    const deleteChatbot = await chatbot.findById(id);
    if (!deleteChatbot) throw new Error("chatbot not found");

    // if there's an unprocessed file, remove it from disk
    if (deleteChatbot.imagePath) {
      await fs.unlink(deleteChatbot?.imagePath?.toString()).catch(() => {});
    }

    await deleteChatbot.deleteOne();
    return true;
  }
}
