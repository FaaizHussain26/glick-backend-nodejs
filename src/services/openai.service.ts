import { ChatCompletionMessageParam } from "openai/resources/chat";
import openai from "../config/openai";
import { pineconeIndex, pineconeShopIndex } from "../config/pinecone";
import getPrompts from "../constant/prompts";
import Chat from "../database/models/chats";
import { saveChatMessage } from "./chat.service";
import { error } from "console";
import { chatbot } from "../database/models/chatbot";

export interface ChatResponse {
  role: "assistant";
  content: string;
  chatbotId?: string;
  id: string;
}

const embeddingCache = new Map<string, number[]>();

const trimMessages = (messages: ChatCompletionMessageParam[]) => {
  return messages.slice(Math.max(messages.length - 10, 0));
};

export const getChatResponse = async (
  message: string,
  chatbotId: string,
  chatId?: string
): Promise<ChatResponse> => {
  let history = [];
  if (chatbotId) {
    const existChatbot = chatbot.findOne({ _id: chatbotId });
    if (!existChatbot) {
      return {
        role: "assistant",
        content: "chatbot Id does not exist",
        id: chatId || "",
      };
    }
  } else {
   return {
        role: "assistant",
        content: "chatbot Id does not exist",
        id: "",
      };
  }

  if (chatId) {
    const chat = await Chat.findOne({ chatId, chatbotId });
    if (!chat) {
      return {
        role: "assistant",
        content: "chat Id does not exist",
        chatbotId: chatbotId,
        id: chatId,
      };
    }

    if (chat?.choices) {
      history = chat.choices;
    }
  }

  const fullMessages: ChatCompletionMessageParam[] = [
    { role: "system", content: getPrompts(history) },
    {
      role: "user",
      content: message,
    },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: fullMessages,
    temperature: 0.7,
    max_tokens: 512,
    top_p: 1,
  });

  const assistantMessageContent = completion.choices[0].message.content || "";

  await saveChatMessage(
    chatId || completion.id,
    chatbotId,
    assistantMessageContent,
    message
  );

  return {
    role: "assistant",
    content: assistantMessageContent,
    chatbotId: chatbotId,
    id: chatId || completion.id,
  };
};

const getRelevantContext = async (
  query: string,
  index: typeof pineconeIndex | typeof pineconeShopIndex,
  includePrice = false
): Promise<string> => {
  const embedding = await getEmbedding(query);

  const result = await index.query({
    topK: 5,
    vector: embedding,
    includeMetadata: true,
  });

  return result.matches
    .map((match) => {
      const meta = match.metadata;
      if (!meta) return "";

      if (includePrice) {
        return `Title: ${meta.title}\nPrice: ${meta.price}\nLink: ${meta.link}`;
      }

      return meta.content || "";
    })
    .filter(Boolean)
    .join("\n\n");
};

const getEmbedding = async (input: string): Promise<number[]> => {
  if (embeddingCache.has(input)) return embeddingCache.get(input)!;

  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input,
  });

  const vector = res.data[0].embedding;
  embeddingCache.set(input, vector);
  return vector;
};
