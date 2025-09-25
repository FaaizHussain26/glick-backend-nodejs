import express, { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
} from "../services/users.service";

const userRouter = express.Router();

userRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, extraData } = req.body;

    if (!firstName || !lastName || !email) {
      res
        .status(400)
        .json({ error: "firstName, lastName, and email are required" });
      return;
    }

    const user = await createUser({ firstName, lastName, email, extraData });
    res.status(201).json(user);
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

userRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    const users = await getUsers({}, limit, skip);
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

userRouter.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

userRouter.delete(
  "/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await deleteUser(req.params.id);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(204).end();
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
);

export default userRouter;
