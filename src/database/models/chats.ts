import mongoose from "mongoose";
import { chatbot } from "./chatbot";

const chatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },

  chatbotId: {
    type: String,
    required: true,
  },

  choices: {
    type: Array,
    required: false,
  },
  isEmail: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model("chats", chatSchema);

export default Chat;
