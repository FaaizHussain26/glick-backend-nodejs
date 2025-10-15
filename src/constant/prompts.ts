const getPrompts = (history?: any[], content?: string) => {
  let hasContactInfo = false;
  let userName = "";
  let userPhone = "";

  if (history && history.length > 0) {
    const recentUserMessages = history
      .filter((msg) => msg.role === "user")
      .slice(-10);

    for (const msg of recentUserMessages) {
      const messageContent = msg.message || msg.messages || "";

      // Phone regex (flexible: +, -, (), spaces, 7–15 digits)
      const phoneRegex = /(\+?\d[\d\-\s()]{7,15}\d)/;
      const phoneMatch = messageContent.match(phoneRegex);

      const nameRegex =
        /(?:name\s*is|i[' ]?m|i am|this is)?\s*([A-Za-z]{2,})(?=\s|$)/i;
      const nameMatch = messageContent.match(nameRegex);

      // ✅ If both are present in the same message
      if (phoneMatch && nameMatch) {
        userPhone = phoneMatch[1];
        userName = nameMatch[1];
        hasContactInfo = true;
        break;
      }

      // ✅ If only phone present, guess name as the last word before phone
      if (phoneMatch && !nameMatch) {
        userPhone = phoneMatch[1];
        const beforePhone = messageContent
          .split(phoneMatch[1])[0]
          .trim()
          .split(/\s+/)
          .pop();
        if (beforePhone && /^[A-Za-z]+$/.test(beforePhone)) {
          userName = beforePhone;
        }
        if (userName) {
          hasContactInfo = true;
          break;
        }
      }

      // ✅ If only name present
      if (nameMatch && !phoneMatch) {
        userName = nameMatch[1];
        // Keep checking next messages for phone
      }
    }

    // ✅ Final check: if we found both across messages
    if (userName && userPhone) {
      hasContactInfo = true;
    }
  }

  const conversationHistory =
    history && history.length > 0
      ? history
          .slice(-6)
          .map(
            (msg) =>
              `${msg.role === "user" ? "Customer" : "Assistant"}: ${
                msg.message || msg.messages || ""
              }`
          )
          .join("\n")
      : "";

  if (hasContactInfo) {
    return `
    ${content?.trim()}
PREVIOUS CONVERSATION:
${conversationHistory}

IMPORTANT: The customer HAS ALREADY PROVIDED their contact information in this conversation${
      userName ? ` (Name: ${userName})` : ""
    }. 
DO NOT ASK FOR CONTACT INFORMATION AGAIN. Proceed directly to answering their questions using the information below and always use English - do not answer in any other language.
`;
  } else {
    return `
ASK FOR CONTACT INFORMATION: The customer has NOT provided their contact information yet. Always ask for their name and phone number in a single question. after answering their questions using the information below. 
Use the following format exactly: "May I have your name and phone number, please?" 
Make sure to always use English - do not answer in any other language.

${content?.trim()}
${
  conversationHistory
    ? `PREVIOUS CONVERSATION:\n${conversationHistory}\n\n`
    : ""
}`;
  }
};

export default getPrompts;
