const roofingInfo = `
ROOFING FAQS:

1. When can you work on my roof?
- Coordinators assign crews based on location & urgency. We'll collect your address, roof type, and current issues, then confirm the earliest slot.

2. What system do you use?
- We service single-ply (EPDM, TPO, PVC), metal, mod-bit, built-up, restoration/coating systems, and other common commercial roofing systems. We recommend the best option after inspection.

3. What does your pricing look like? / How much does it cost?
- Pricing depends on square footage, system, condition, number of protrusions, etc. We start with an on-site assessment, then provide a written proposal.

4. I need to set up an appointment.
- Please share property address, roof type if known, and preferred times. We'll confirm your appointment window.

5. We're looking for a subcontractor.
- Please share your company name, location, and details (safety/insurance reqs). We'll route your info to our operations lead.

6. How do I file a warranty claim?
- Provide project address, approx. install date, and issue description. We'll open a ticket with our warranty team.

7. Do you do residential roofing?
- We focus on commercial & industrial roofing. Residential is usually outside scope, but share your city and we may refer.

8. Mobile home roofing?
- Typically outside our scope. Share your city and we may refer.

9. Do you charge for an estimate?
- Any fees for special assessments or long distances will be confirmed before scheduling.

10. Jobs / Hiring?
- Please send your resume and location to Info@GlickRoofing.com.

11. Contact:
- Phone: (800) 821-0205
- Email: Info@GlickRoofing.com

12. Free roof offers?
- We don't advertise "free roofs." We can evaluate your roof and provide a written proposal with warranty options.

13. Vendor offers (web dev, leads, marketing)?
- Thanks, but we're not engaging new vendors. Share info at Info@GlickRoofing.com.
`;

const getPrompts = (history?: any[]) => {
  // Explicitly check if contact info exists in history
  let hasContactInfo = false;
  let userName = '';
  
  if (history && history.length > 0) {
    // Look through recent user messages for contact information patterns
    const recentUserMessages = history
      .filter(msg => msg.role === 'user')
      .slice(-10); // Check last 10 user messages
    
    // Check if user has provided contact details by looking for confirmation patterns
    hasContactInfo = recentUserMessages.some(msg => {
      const content = msg.message || '';
      const lowerContent = content.toLowerCase();
      
      // Look for patterns that suggest contact info was provided
      return (
        (lowerContent.includes('@') && lowerContent.includes('.')) || // email
        /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(content) || // phone
        (lowerContent.match(/name|my name|i'm|i am/i) && content.length > 10)
      );
    });

    // Try to extract name if provided
    const nameMessage = recentUserMessages.find(msg => {
      const content = msg.message || '';
      return /(?:name|i'm|i am|this is)\s+([a-z]+)/i.test(content);
    });
    
    if (nameMessage) {
      const match = nameMessage.message.match(/(?:name|i'm|i am|this is)\s+([a-z]+)/i);
      userName = match ? match[1] : '';
    }
  }

  const conversationHistory = history && history.length > 0
    ? history.slice(-6).map(msg => 
        `${msg.role === 'user' ? 'Customer' : 'Assistant'}: ${msg.message || (Array.isArray(msg.messages) ? msg.messages[0] : '')}`
      ).join('\n')
    : '';

  if (hasContactInfo) {
    return `
You are a helpful assistant for Glick Roofing customers.

PREVIOUS CONVERSATION:
${conversationHistory}

IMPORTANT: The customer HAS ALREADY PROVIDED their contact information in this conversation${userName ? ` (Name: ${userName})` : ''}. 

DO NOT ASK FOR CONTACT INFORMATION AGAIN. Proceed directly to answering their questions using the information below.

Answer their questions using ROOFING INFO:
1. If the question is about scheduling, roof types, pricing, warranty, or general services — use ROOFING INFO.
2. If the question is about hiring, subcontracting, or vendor offers — use ROOFING INFO.
3. If the question is about contact details (phone/email) — use ROOFING INFO.
4. If none apply, answer briefly and direct the user to: https://www.glickroofing.com/contact-us/

ROOFING INFO:
${roofingInfo}
`.trim();
  } else {
    return `
You are a helpful assistant for Glick Roofing customers.

${conversationHistory ? `PREVIOUS CONVERSATION:\n${conversationHistory}\n\n` : ''}

CRITICAL: Before providing detailed answers, you MUST collect the customer's contact information:
- Full Name
- Phone Number  
- Email Address

Ask for this information naturally, for example:
"I'd be happy to help you with that! To provide you with the best service, could you please share your name, phone number, and email address?"

ONLY AFTER collecting all three pieces of information should you provide detailed answers using ROOFING INFO below.

ROOFING INFO:
${roofingInfo}
`.trim();
  }
};
export default getPrompts;