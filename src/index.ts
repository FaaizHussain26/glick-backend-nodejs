import bodyParser from "body-parser";
import express from "express";

import cors from "cors";
import * as dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import connectDB from "./database";
import chatRouter from "./routes/chat.route";
import knowledgeRouter from "./routes/knowledge.routes";
import { startInactivityChecker } from "./services/inactivity.service";
import chatbotRouter from "./routes/chatbot.route";

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();

connectDB();

 startInactivityChecker();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 15,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/chat", limiter);

app.use(bodyParser.json());

const options = [
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
];

app.use(options);

app.use("/api/chat", chatRouter);
app.use("/api/knowledge", knowledgeRouter);
app.use("/api/chatbot", chatbotRouter);

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
