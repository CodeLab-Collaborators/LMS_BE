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
exports.completeCourse = exports.getStudentCourseWithModules = exports.startCourseService = void 0;
// import { getTrackWithCourses } from "../../ADMIN_PORTAL/services/tracks";
const globalFunctions_1 = require("../../utils/globalFunctions");
const AppError_1 = require("../../utils/AppError");
const studentCourse_1 = __importDefault(require("../models/studentCourse"));
const studentTrack_1 = __importDefault(require("../models/studentTrack"));
const trackCourse_1 = __importDefault(require("../../ADMIN_PORTAL/models/trackCourse"));
const courses_1 = require("../../ADMIN_PORTAL/services/courses");
const studentModule_1 = __importDefault(require("../models/studentModule"));
exports.startCourseService = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentID, trackID, courseID } = req.params;
    try {
        // Check if there's an existing student course in "started" or "in progress" status
        const existingCourse = yield studentCourse_1.default.findOne({
            studentID,
            trackID,
            status: { $ne: "completed" },
        });
        if (existingCourse) {
            return res.status(AppError_1.HttpCode.BAD_REQUEST).json({
                message: "Cannot start a new course until the previous course is completed",
            });
        }
        // Check if the selected course is associated with the track
        const selectedCourse = yield trackCourse_1.default.findOne({
            trackID,
            courseID,
        });
        if (!selectedCourse) {
            return res.status(AppError_1.HttpCode.NOT_FOUND).json({
                message: "Selected course not found in the track",
            });
        }
        // Update the StudentTrack status to "in progress"
        yield studentTrack_1.default.updateOne({ studentID, trackID }, { $set: { status: "in progress" } });
        // Insert the selected course into the StudentCourse collection
        const studentCourseData = {
            studentID,
            trackID,
            courseID,
            status: "started",
            startDate: new Date().toISOString(),
        };
        yield studentCourse_1.default.create(studentCourseData);
        return res.status(AppError_1.HttpCode.OK).json({
            message: "Course started successfully",
            studentID,
            trackID,
            courseID,
        });
    }
    catch (error) {
        next(new AppError_1.AppError({
            message: "Error starting course",
            httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
        }));
    }
}));
// export const startCourseService = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { studentID, trackID, courseID } = req.params;
//     try {
//       // Check if the course is already started, in progress, or completed by the student
//       const currentCourse = await StudentCourse.findOne({
//         studentID,
//         trackID,
//         courseID,
//       });
//       if (currentCourse) {
//         if (currentCourse.status === "completed") {
//           // The previous course is completed, allow starting a new course
//           // Continue with the code below
//         } else if (
//           currentCourse.status === "started" ||
//           currentCourse.status === "in progress"
//         ) {
//           return res.status(HttpCode.BAD_REQUEST).json({
//             message:
//               "Cannot start a new course until the previous course is completed",
//           });
//         }
//       }
//       // Check if the selected course is associated with the track
//       const selectedCourse = await TrackCourse.findOne({
//         trackID,
//         courseID,
//       });
//       if (!selectedCourse) {
//         return res.status(HttpCode.NOT_FOUND).json({
//           message: "Selected course not found in the track",
//         });
//       }
//       // Update the StudentTrack status to "in progress"
//       await StudentTrack.updateOne(
//         { studentID, trackID },
//         { $set: { status: "in progress" } }
//       );
//       // Insert the selected course into the StudentCourse collection
//       const studentCourseData = {
//         studentID,
//         trackID,
//         courseID,
//         status: "started",
//         startDate: new Date().toISOString(),
//       };
//       await StudentCourse.create(studentCourseData);
//       return res.status(HttpCode.OK).json({
//         message: "Course started successfully",
//         studentID,
//         trackID,
//         courseID,
//       });
//     } catch (error) {
//       next(
//         new AppError({
//           message: "Error starting course",
//           httpCode: HttpCode.INTERNAL_SERVER_ERROR,
//         })
//       );
//     }
//   }
// );
exports.getStudentCourseWithModules = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentID, courseID } = req.params;
    try {
        // Check if the student has started the course
        const startedCourse = yield studentCourse_1.default.findOne({
            studentID,
            courseID,
        });
        if (!startedCourse) {
            return res.status(AppError_1.HttpCode.NOT_FOUND).json({
                message: "Course not found or not started by the student",
            });
        }
        // Fetch modules associated with the course
        const modulesMappedToCourse = yield (0, courses_1.getCourseWithModules)(courseID);
        if (modulesMappedToCourse.length === 0) {
            return res.status(AppError_1.HttpCode.NOT_FOUND).json({
                message: "Course has no associated modules",
            });
        }
        return res.status(AppError_1.HttpCode.OK).json({
            message: "Course with modules retrieved successfully",
            startedCourse,
            modulesMappedToCourse,
        });
    }
    catch (error) {
        next(new AppError_1.AppError({
            message: "Error retrieving course with modules",
            httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
        }));
    }
}));
exports.completeCourse = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentID, trackID, courseID } = req.params;
    try {
        // Check if all modules within the course are completed by the student
        const allModulesCompleted = yield studentModule_1.default.exists({
            studentID,
            courseID,
            status: { $all: "completed" },
        });
        if (!allModulesCompleted) {
            return res.status(AppError_1.HttpCode.BAD_REQUEST).json({
                message: "All modules within the course must be completed to finish the course",
            });
        }
        // Calculate the average completion percentage for the track
        const completedCourses = yield studentCourse_1.default.find({
            studentID,
            trackID,
            status: "completed",
        });
        const totalCompletedCourses = completedCourses.length;
        const totalCoursesInTrack = yield studentCourse_1.default.countDocuments({
            studentID,
            trackID,
        });
        const completionAverage = (totalCompletedCourses / totalCoursesInTrack) * 100;
        // Update the StudentTrack completion_average field and status
        yield studentTrack_1.default.updateOne({ studentID, trackID }, {
            $set: {
                completion_average: completionAverage,
                status: "in progress",
            },
        });
        return res.status(AppError_1.HttpCode.OK).json({
            message: "Course completed successfully",
        });
    }
    catch (error) {
        next(new AppError_1.AppError({
            message: "Error completing course",
            httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
        }));
    }
}));
