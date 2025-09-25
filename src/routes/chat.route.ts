import express, { Request, Response } from "express";
import { getChatResponse } from "../services/openai.service";
import Chat from "../database/models/chats";

const chatRouter = express.Router();

chatRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages } = req.body;

    if (!messages || messages.length === 0) {
      res.status(400).json({ error: "Messages are required" });
      return;
    }

    const response = await getChatResponse(messages, req);

    res.json(response);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process your request" });
  }
});

chatRouter.get('/history', async (req: Request, res: Response): Promise<void> => {
    try {
        const history = await Chat.find().sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        console.error("Chat history error:", error);
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
})

export default chatRouter;
