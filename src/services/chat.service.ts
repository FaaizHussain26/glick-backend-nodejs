import Chat from "../database/models/chats";

export type Message = {
  role: string;
  content: string;
};

const saveChatMessage = async (
  conversationId: string,
  ip: string | string[],
  messages: Message | Message[] 
) => {
  try {
    const newMessages = Array.isArray(messages) ? messages : [messages];

    let chat = await Chat.findOne({ ip: ip });

    if (!chat) {
      chat = new Chat({
        ip: ip,
        chatId: conversationId,
        choices: newMessages,
      });
    } else {
      chat.choices = [...(chat.choices || []), ...newMessages];
      chat.updatedAt = new Date();
    }

    await chat.save();
  } catch (error) {
    console.error("Error saving chat message:", error);
    throw error;
  }
};

export { saveChatMessage };
