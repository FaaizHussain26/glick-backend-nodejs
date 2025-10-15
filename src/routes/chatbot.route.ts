import { Router } from "express";

import { fileupload } from "../middleware/upload.middleware";
import { ChatbotController } from "../controller/chatbot.controller";

const router = Router();

router.post("/", fileupload().single("file"), ChatbotController.create);
router.get("/", ChatbotController.getAll);
router.get("/:id", ChatbotController.getById);
router.put(
  "/:id",
  fileupload().single("file"),
  ChatbotController.update
);
router.delete("/:id", ChatbotController.delete);

export default router;
