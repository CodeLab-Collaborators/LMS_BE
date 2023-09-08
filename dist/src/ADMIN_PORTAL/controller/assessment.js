"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuestionController = exports.createAssessmentController = void 0;
const assessment_1 = require("../services/assessment");
const createAssessmentController = (req, res, next) => (0, assessment_1.createAssessment)(req, res, next);
exports.createAssessmentController = createAssessmentController;
const createQuestionController = (req, res, next) => (0, assessment_1.createQuestionService)(req, res, next);
exports.createQuestionController = createQuestionController;
