"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentModule_1 = require("../controller/studentModule");
const studentModuleRouter = (0, express_1.Router)();
studentModuleRouter.post("/student-start-module/:studentID/:courseID/:moduleID", studentModule_1.startModuleController);
studentModuleRouter.post("/student-complete-module/:trackID/:studentID/:courseID/:moduleID", studentModule_1.completeModuleController);
studentModuleRouter.get("/student-module/:studentID/:courseID/:moduleID", studentModule_1.getModuleController);
exports.default = studentModuleRouter;
