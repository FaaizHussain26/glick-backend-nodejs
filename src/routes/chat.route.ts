import express, { Request, Response } from "express";
import { getChatResponse } from "../services/openai.service";
import Chat from "../database/models/chats";
import { sendConversationEmail } from "../services/email.service";

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

chatRouter.get(
  "/histories",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const history = await Chat.find().sort({ createdAt: -1 });
      res.json(history);
    } catch (error) {
      console.error("Chat history error:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  }
);

chatRouter.get("/email", async (req: Request, res: Response): Promise<void> => {
  try {
    const { chatId, recipientEmail } = req.query;
    if (!chatId || !recipientEmail) {
      res.status(400).json({ error: "chatId and recipientEmail are required" });
      return;
    }
    const output = await sendConversationEmail(
      chatId as string,
      recipientEmail as string
    );
    res.json({ success: true, message: output });
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
      const result = await Chat.deleteOne
      ({ _id:id });
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
