import { Request, Response } from "express";
import { KnowledgeService } from "../services/knowlege/knowlege.service";

export class KnowledgeController {
  static async upload(req: Request, res: Response) {
    try {
      const { title, chatbot_id } = req.body;
      if (!title || !chatbot_id) {
        return res
          .status(400)
          .json({ error: "title and chatbot_id are required" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "File is required" });
      }

      const result = await KnowledgeService.createKnowledge(
        title,
        chatbot_id,
        req.file
      );

      if (result.error) {
        return res.status(200).json({
          message: "File stored but extraction failed",
          knowledge: result.knowledge,
          error: result.error,
        });
      }

      return res.status(201).json({
        message: "Knowledge created successfully",
        knowledge: result.knowledge
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getAll(req: Request, res: Response) {
    const data = await KnowledgeService.getAll();
    res.json(data);
  }

  static async getById(req: Request, res: Response) {
    const knowledge = await KnowledgeService.getById(req.params.id);
    if (!knowledge) return res.status(404).json({ error: "Not found" });
    res.json(knowledge);
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, chatbot_id } = req.body;

      const updates: any = {};
      if (title) updates.title = title;
      if (chatbot_id) updates.chatbotId = chatbot_id;
      if (req.file) updates.file = req.file;

      const updated = await KnowledgeService.updateKnowledge(id, updates);
      res.json({
        message: "Knowledge updated successfully",
        knowledge: updated,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await KnowledgeService.deleteKnowledge(id);
      res.json({ message: "Knowledge deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
