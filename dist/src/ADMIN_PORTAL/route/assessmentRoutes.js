"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assessment_1 = require("../controller/assessment");
const assessmentRouter = (0, express_1.Router)();
assessmentRouter.post("/assessment/:courseID", assessment_1.createAssessmentController);
assessmentRouter.post("/assessment-question/:assessmentID", assessment_1.createQuestionController);
exports.default = assessmentRouter;
