import cron from "node-cron";
import Chat from "../database/models/chats";
import { sendConversationEmail } from "../services/email.service";
import { appConfig } from "../constant/email-config";

let isRunning = false;

export const checkInactiveUsers = async (): Promise<void> => {
  if (isRunning) {
    console.log("⏭️  Previous check still running, skipping...");
    return;
  }

  isRunning = true;
  console.log("🔍 Checking for inactive users...");

  try {
    const thresholdTime = new Date(Date.now() - appConfig.inactivityThreshold);
    const inactiveChats = await Chat.find({
      updatedAt: { $lte: thresholdTime },
      isEmail: false,
    })
      .limit(appConfig.batchLimit)
      .lean();

    console.log(`Found ${inactiveChats.length} inactive users`);

    if (inactiveChats.length === 0) {
      console.log("No inactive users found");
      return;
    }

    // Process emails in parallel with Promise.allSettled
    const emailResults = await Promise.allSettled(
      inactiveChats.map(async (chat) => {
        try {
          const result = await sendConversationEmail(
            chat.chatbotId,
            chat.chatId
          );

          if (result && (result as any).success) {
            // Mark email as sent
            await Chat.updateOne({ chatId: chat.chatId }, { isEmail: true });
            console.log(`Successfully processed chat: ${chat.chatId}`);
          } else {
            console.error(
              `Failed to send email for chat ${chat.chatId}: ${result.error}`
            );
          }

          return result;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          console.error(`error processing chat ${chat.chatId}:`, errorMessage);
          throw error;
        }
      })
    );

    // // Log summary
    const successful = emailResults.filter(
      (r) => r.status === "fulfilled"
    ).length;
    const failed = emailResults.filter((r) => r.status === "rejected").length;
    console.log(`📈 Summary: ${successful} succeeded, ${failed} failed`);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Error in inactivity checker:", errorMessage);
  } finally {
    isRunning = false;
    console.log("✅ Inactivity check completed\n");
  }
};

export const startInactivityChecker = (): void => {
  cron.schedule(appConfig.checkInterval, () => {
    checkInactiveUsers();
  });

  console.log(`🚀 Inactivity checker started (runs every 5 minutes)`);
};

// For manual testing
export const runInactivityCheckOnce = async (): Promise<void> => {
  await checkInactiveUsers();
};
