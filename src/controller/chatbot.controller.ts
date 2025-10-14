import fs from "fs";
import { Request, Response } from "express";
import { ChatbotService } from "../services/chatbot.service";

export class ChatbotController {
  static async create(req: Request, res: Response) {
    try {
      const { title, subTitle, firstMessage, colorCode } = req.body;
      if (!title || !subTitle || !colorCode) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ error: "Field are required" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "File is required" });
      }

      const result = await ChatbotService.createChatbot(
        title,
        subTitle,
        colorCode,
        req.file,
        firstMessage
      );

      if (result.error) {
        return res.status(200).json({
          message: "File stored but db save failed",
          data: result.newChatbot,
          error: result.error,
        });
      }

      return res.status(201).json({
        message: "chatbot created successfully",
        data: result.newChatbot,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getAll(req: Request, res: Response) {
    const data = await ChatbotService.getAll();
    res.json(data);
  }

  static async getById(req: Request, res: Response) {
    const data = await ChatbotService.getById(req.params.id);
    if (!data) return res.status(404).json({ error: "Not found" });
    res.json(data);
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, subTitle, firstMessage, colorCode } = req.body;

      const updates: any = {};
      if (title) updates.title = title;
      if (subTitle) updates.subTitle = subTitle;
      if (firstMessage) updates.firstMessage = firstMessage;
      if (colorCode) updates.colorCode = colorCode;
      if (req.file) updates.file = req.file;

      const updated = await ChatbotService.updateChatbot(id, updates);
      res.json({
        message: "chatbot updated successfully",
        data: updated,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ChatbotService.deleteChatbot(id);
      res.json({ message: "chatbot deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
