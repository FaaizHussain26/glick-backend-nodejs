import express, { Request, Response } from "express";
import { getChatResponse } from "../services/openai.service";
import Chat from "../database/models/chats";
import { runInactivityCheckOnce } from "../services/inactivity.service";

const chatRouter = express.Router();

chatRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, chatbotId, chatId } = req.body;
    if (!messages || messages.length === 0) {
      res.status(400).json({ error: "Messages are required" });
      return;
    }

    const response = await getChatResponse(messages, chatbotId, chatId);

    res.json(response);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process your request" });
  }
});

chatRouter.get(
  "/history/:chatId",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { chatId } = req.params;
      if (!chatId) {
        res.status(400).json({ error: "chatId are required" });
        return;
      }
      const history = await Chat.findOne({_id: chatId})
        .select("choices")
        .lean();

      if (!history) {
        res.status(404).json({ error: "Conversation not found" });
        return;
      }

      const conversation = history.choices ?? [];
      const totalMessages = Array.isArray(conversation)
        ? conversation.length
        : 0;

      res.json({
        chatId,
        conversation,
        total_messages: totalMessages,
      });
    } catch (error) {
      console.error("Chat history error:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  }
);

chatRouter.get(
  "/histories",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { chatbotId } = req.query;
      const filter: Record<string, any> = {};
      if (chatbotId) {
        filter.chatbotId = chatbotId;
      }
      const history = await Chat.find(filter).sort({ createdAt: -1 }).lean();
      res.json(history);
    } catch (error) {
      console.error("Chat history error:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  }
);

chatRouter.get("/email", async (req: Request, res: Response): Promise<void> => {
  try {
    runInactivityCheckOnce();
    res.json({ success: true });
  } catch (error) {
    console.error("Email route error:", error);
    res.status(500).json({ error: "Failed to process email route" });
  }
});

chatRouter.delete(
  "/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const result = await Chat.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        res.status(404).json({ error: "Conversation not found" });
        return;
      }
      res.json({ message: "Conversation deleted successfully" });
    } catch (error) {
      console.error("Delete chat error:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  }
);
export default chatRouter;
