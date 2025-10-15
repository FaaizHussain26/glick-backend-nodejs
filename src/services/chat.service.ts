import { chatbot } from "../database/models/chatbot";
import Chat from "../database/models/chats";

export type Message = {
  role: string;
  message: string; 
  timestamp: Date;
};

const saveChatMessage = async (
  conversationId: string,
  chatbotId: string,
  aiResponse: string,
  userMessage: string
) => {
  try {
    let chat = await Chat.findOne({ chatId: conversationId , chatbotId: chatbotId });

    if (!chat) {
      chat = new Chat({
        chatId: conversationId,
        chatbotId: chatbotId,
        choices: [
          { role: "user", messages: userMessage, timestamp: new Date() },
          { role: "assistant", messages: aiResponse, timestamp: new Date() },
        ],
      });
    } else {
      chat.choices = chat.choices || [];
      chat.choices.push(
        { role: "user", messages: userMessage, timestamp: new Date() },
        { role: "assistant", messages: aiResponse, timestamp: new Date() }
      );
      chat.updatedAt = new Date();
    }

    await chat.save();
  } catch (error) {
    console.error("Error saving chat message:", error);
    throw error;
  }
};
export { saveChatMessage };

