"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controller/auth");
const authRouter = (0, express_1.Router)();
authRouter.get("/", (req, res) => {
    res.status(200).json({ message: `Student portal ready 🔥🔥🔥` });
});
// auth
authRouter.post("/register", auth_1.registerController);
authRouter.post("/login", auth_1.loginController);
authRouter.patch("/profile/:studentID", auth_1.profileUpdateController);
authRouter.get("/profile/:studentID", auth_1.getStudentProfileController);
exports.default = authRouter;
