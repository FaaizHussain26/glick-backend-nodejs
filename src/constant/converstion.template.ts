interface Message {
  role: "user" | "assistant";
  messages: string;
  timestamp: string | number | Date;
}

export function generateConversationHTML(messages: Message[]) {
  const conversationHTML = messages
    .map((msg) => {
      const isUser = msg.role === "user";
      return `
        <div style="
          margin-bottom: 10px;
          padding: 15px;
          border-radius: 8px;
          background-color: ${isUser ? "#e9ebee" : "#03a84e"};
          max-width: 50%;
          ${isUser ? "margin-left:auto;" : "margin-right:auto;"}
        ">
          <strong style="color:${isUser ? "#000000ff" : "#ffffffff"}">
            ${msg.role.toUpperCase()}
          </strong>
          <div style="margin-top:5px; font-size:15px; color: ${
            isUser ? "#000000ff" : "#ffffffff"
          }">
            ${msg.messages}
          </div>
          <div style="font-size:12px; color:${
            isUser ? "#000000ff" : "#ffffffff"
          }; text-align:right;">
            ${new Date(msg.timestamp).toLocaleString()}
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <div style="font-family:Arial, sans-serif; padding:20px; background:#e9ebee; width: 75%;  border-radius: 10px;  margin:auto;">
      <h2 style="text-align:center; color:#444;">Chat Conversation</h2>
      <div style="background:white; padding:15px; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.1);">
        ${conversationHTML}
      </div>
    </div>
  `;
}
