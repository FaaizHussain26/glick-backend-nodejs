import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },

  choices: {
    type: Array,
    required: false,
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
