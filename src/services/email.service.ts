import { transporter } from "../constant/email-config";
import Chat from "../database/models/chats";
import { generateConversationHTML } from "../constant/converstion.template";
import { chatbot } from "../database/models/chatbot";

async function sendConversationEmail(chatbotId:string , chatId: string) {
  try {
    const chat = await Chat.findOne({ chatId , chatbotId});
    if (!chat) throw new Error("Chat not found");

    const chatbotTitle= await chatbot.findOne({ _id: chatbotId });
    if (!chatbot) throw new Error("Chatbot not found"); 

    const htmlContent = generateConversationHTML(chat.choices ?? []);

    const mailOptions = {
      from: process.env.BREVO_USER,
      to: process.env.EMAIL_SEND_TO,
      subject: `Chat Conversation of ${chatbotTitle?.title} - ${chatId}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: "Email Sent Successfully!",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export { sendConversationEmail };
