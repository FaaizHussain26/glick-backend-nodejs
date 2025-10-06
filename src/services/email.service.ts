import { transporter } from "../constant/email-config";
import Chat from "../database/models/chats";
import { generateConversationHTML } from "../constant/converstion.template";

async function sendConversationEmail(chatId: string, recipientEmail: string) {
  try {
    const chat = await Chat.findOne({ chatId });
    if (!chat) throw new Error("Chat not found");

    const htmlContent = generateConversationHTML(chat.choices ?? []);

    const mailOptions = {
      from: process.env.BREVO_USER,
      to: recipientEmail,
      subject: `Chat Conversation - ${chatId}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return "Email Sent Successfully!";
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export { sendConversationEmail };
