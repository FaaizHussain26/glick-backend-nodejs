import express, { Request, Response } from "express";
import { getChatResponse } from "../services/openai.service";
import Chat from "../database/models/chats";

const chatRouter = express.Router();

chatRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, chatId } = req.body;
    if (!messages || messages.length === 0) {
      res.status(400).json({ error: "Messages are required" });
      return;
    }

    const response = await getChatResponse(messages, chatId);

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
      const chatId = req.params;
      const history = await Chat.findOne(chatId).select("choices").lean();
      if (!history) {
        res.status(404).json({ error: "Conversation not found" });
      }

      res.json({
        chatId: chatId.chatId,
        conversation: history?.choices,
        total_messages: Array.isArray(history?.choices)
          ? history?.choices.length
          : 0,
      });
    } catch (error) {
      console.error("Chat history error:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  }
);

export default chatRouter;
