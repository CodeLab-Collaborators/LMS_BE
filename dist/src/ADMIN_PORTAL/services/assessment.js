"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuestionService = exports.createAssessment = void 0;
const globalFunctions_1 = require("../../utils/globalFunctions");
const AppError_1 = require("../../utils/AppError");
const CourseAssessment_1 = __importDefault(require("../models/CourseAssessment"));
const courses_1 = __importDefault(require("../models/courses"));
const randomstring_1 = require("randomstring");
exports.createAssessment = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assessmentID, title, description, questions, courseID } = req.body;
        if (!title || !description) {
            return res.status(AppError_1.HttpCode.BAD_REQUEST).json({
                message: "Invalid request data",
            });
        }
        const assessmentCourse = yield courses_1.default.findOne({
            courseID: req.params.courseID,
        });
        if (!assessmentCourse) {
            next(new AppError_1.AppError({
                message: "Error creating assessment",
                httpCode: AppError_1.HttpCode.BAD_REQUEST,
            }));
        }
        // Create the assessment
        const assessment = new CourseAssessment_1.default({
            assessmentID: (0, randomstring_1.generate)(6),
            courseID: assessmentCourse === null || assessmentCourse === void 0 ? void 0 : assessmentCourse.courseID,
            title,
            description,
            questions: questions || [],
        });
        yield assessment.save();
        return res.status(AppError_1.HttpCode.CREATED).json({
            message: "Assessment created successfully",
            assessment,
        });
    }
    catch (error) {
        next(new AppError_1.AppError({
            message: "Error creating assessment",
            httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
        }));
    }
}));
function createQuestions(questionText, options, correctAnswer) {
    if (options.length < 3 || options.length > 4) {
        throw new Error("Invalid number of options. Expected 3 or 4 options.");
    }
    if (!options.includes(correctAnswer)) {
        throw new Error("The correctAnswer must be one of the provided options.");
    }
    const questions = [
        {
            questionText,
            options,
            correctAnswer,
        },
    ];
    return questions;
}
exports.createQuestionService = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionText, options, correctAnswer } = req.body;
        if (!questionText || !options || !correctAnswer) {
            return res.status(AppError_1.HttpCode.BAD_REQUEST).json({
                message: "Invalid request data",
            });
        }
        // Fetch the assessment
        const assessment = yield CourseAssessment_1.default.findOne({
            assessmentID: req.params.assessmentID,
        });
        if (!assessment) {
            return res.status(AppError_1.HttpCode.NOT_FOUND).json({
                message: "Assessment not found",
            });
        }
        // Create the question using the createQuestions function
        const questions = createQuestions(questionText, options, correctAnswer);
        // Update the assessment with the new questions
        assessment.questions.push(...questions);
        yield assessment.save();
        return res.status(AppError_1.HttpCode.OK).json({
            message: "Question added to assessment",
            assessment,
        });
    }
    catch (error) {
        next(new AppError_1.AppError({
            message: "Error adding question to assessment",
            httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
        }));
    }
}));
// export const createQuestion = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { questionText, options, correctAnswer } = req.body;
//       if (!questionText || !options || !correctAnswer) {
//         return res.status(HttpCode.BAD_REQUEST).json({
//           message: "Invalid request data",
//         });
//       }
//       if (options.length < 3 || options.length > 4) {
//         return res.status(HttpCode.BAD_REQUEST).json({
//           message: "Invalid number of options. Expected 3 or 4 options.",
//         });
//       }
//       if (!options.includes(correctAnswer)) {
//         return res.status(HttpCode.BAD_REQUEST).json({
//           message: "The correctAnswer must be one of the provided options.",
//         });
//       }
//       const questions = [
//         {
//           questionText,
//           options,
//           correctAnswer,
//         },
//       ];
//       return res.status(HttpCode.OK).json({
//         message: "Questions created successfully",
//         questions,
//       });
//     } catch (error) {
//       next(
//         new AppError({
//           message: "Error creating questions",
//           httpCode: HttpCode.INTERNAL_SERVER_ERROR,
//         })
//       );
//     }
//   }
// );
