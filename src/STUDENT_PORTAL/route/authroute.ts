import { Router } from "express";
import {
  getStudentProfileController,
  loginController,
  profileUpdateController,
  registerController,
} from "../controller/auth";

const authRouter = Router();

authRouter.get("/", (req, res) => {
  res.status(200).json({ message: `Student portal ready 🔥🔥🔥` });
});

// auth
authRouter.post("/register", registerController);
authRouter.post("/login", loginController);

authRouter.patch("/profile/:studentID", profileUpdateController);
authRouter.get("/profile/:studentID", getStudentProfileController);
export default authRouter;
