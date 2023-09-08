import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/globalFunctions";
import { AppError, HttpCode } from "../../utils/AppError";
import CourseAssessment from "../models/CourseAssessment";
import Courses from "../models/courses";
import { generate } from "randomstring";

export const createAssessment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { assessmentID, title, description, questions, courseID } =
        req.body;

      if (!title || !description) {
        return res.status(HttpCode.BAD_REQUEST).json({
          message: "Invalid request data",
        });
      }

      const assessmentCourse = await Courses.findOne({
        courseID: req.params.courseID,
      });

      if (!assessmentCourse) {
        next(
          new AppError({
            message: "Error creating assessment",
            httpCode: HttpCode.BAD_REQUEST,
          })
        );
      }
      // Create the assessment
      const assessment = new CourseAssessment({
        assessmentID: generate(6),
        courseID: assessmentCourse?.courseID,
        title,
        description,
        questions: questions || [],
      });

      await assessment!.save();
      return res.status(HttpCode.CREATED).json({
        message: "Assessment created successfully",
        assessment,
      });
    } catch (error) {
      next(
        new AppError({
          message: "Error creating assessment",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

function createQuestions(
  questionText: string,
  options: string[],
  correctAnswer: string
) {
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

export const createQuestionService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { questionText, options, correctAnswer } = req.body;

      if (!questionText || !options || !correctAnswer) {
        return res.status(HttpCode.BAD_REQUEST).json({
          message: "Invalid request data",
        });
      }

      // Fetch the assessment
      const assessment = await CourseAssessment.findOne({
        assessmentID: req.params.assessmentID,
      });

      if (!assessment) {
        return res.status(HttpCode.NOT_FOUND).json({
          message: "Assessment not found",
        });
      }

      // Create the question using the createQuestions function
      const questions = createQuestions(questionText, options, correctAnswer);

      // Update the assessment with the new questions
      assessment.questions.push(...questions);
      await assessment.save();

      return res.status(HttpCode.OK).json({
        message: "Question added to assessment",
        assessment,
      });
    } catch (error) {
      next(
        new AppError({
          message: "Error adding question to assessment",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

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
