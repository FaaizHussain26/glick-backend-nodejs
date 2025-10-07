import { transporter } from "../constant/email-config";
import Chat from "../database/models/chats";
import { generateConversationHTML } from "../constant/converstion.template";

async function sendConversationEmail(chatId: string) {
  try {
    const chat = await Chat.findOne({ chatId });
    if (!chat) throw new Error("Chat not found");

    const htmlContent = generateConversationHTML(chat.choices ?? []);

    const mailOptions = {
      from: process.env.BREVO_USER,
      to: process.env.EMAIL_SEND_TO,
      subject: `Chat Conversation - ${chatId}`,
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
