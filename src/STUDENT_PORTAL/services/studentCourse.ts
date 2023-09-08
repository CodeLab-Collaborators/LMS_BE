// import { getTrackWithCourses } from "../../ADMIN_PORTAL/services/tracks";
import { asyncHandler } from "../../utils/globalFunctions";
import { AppError, HttpCode } from "../../utils/AppError";
import { NextFunction, Request, Response } from "express";
import StudentCourse from "../models/studentCourse";
import StudentTrack from "../models/studentTrack";
import TrackCourse from "../../ADMIN_PORTAL/models/trackCourse";
import { getCourseWithModules } from "../../ADMIN_PORTAL/services/courses";
import StudentModule from "../models/studentModule";

export const startCourseService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentID, trackID, courseID } = req.params;

    try {
      // Check if there's an existing student course in "started" or "in progress" status
      const existingCourse = await StudentCourse.findOne({
        studentID,
        trackID,
        status: { $ne: "completed" },
      });

      if (existingCourse) {
        return res.status(HttpCode.BAD_REQUEST).json({
          message:
            "Cannot start a new course until the previous course is completed",
        });
      }

      // Check if the selected course is associated with the track
      const selectedCourse = await TrackCourse.findOne({
        trackID,
        courseID,
      });

      if (!selectedCourse) {
        return res.status(HttpCode.NOT_FOUND).json({
          message: "Selected course not found in the track",
        });
      }

      // Update the StudentTrack status to "in progress"
      await StudentTrack.updateOne(
        { studentID, trackID },
        { $set: { status: "in progress" } }
      );

      // Insert the selected course into the StudentCourse collection
      const studentCourseData = {
        studentID,
        trackID,
        courseID,
        status: "started",
        startDate: new Date().toISOString(),
      };

      await StudentCourse.create(studentCourseData);

      return res.status(HttpCode.OK).json({
        message: "Course started successfully",
        studentID,
        trackID,
        courseID,
      });
    } catch (error) {
      next(
        new AppError({
          message: "Error starting course",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

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

export const getStudentCourseWithModules = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentID, courseID } = req.params;

    try {
      // Check if the student has started the course
      const startedCourse = await StudentCourse.findOne({
        studentID,
        courseID,
      });

      if (!startedCourse) {
        return res.status(HttpCode.NOT_FOUND).json({
          message: "Course not found or not started by the student",
        });
      }

      // Fetch modules associated with the course
      const modulesMappedToCourse = await getCourseWithModules(courseID);

      if (modulesMappedToCourse.length === 0) {
        return res.status(HttpCode.NOT_FOUND).json({
          message: "Course has no associated modules",
        });
      }

      return res.status(HttpCode.OK).json({
        message: "Course with modules retrieved successfully",
        startedCourse,
        modulesMappedToCourse,
      });
    } catch (error) {
      next(
        new AppError({
          message: "Error retrieving course with modules",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const completeCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentID, trackID, courseID } = req.params;

    try {
      // Check if all modules within the course are completed by the student
      const allModulesCompleted = await StudentModule.exists({
        studentID,
        courseID,
        status: { $all: "completed" },
      });

      if (!allModulesCompleted) {
        return res.status(HttpCode.BAD_REQUEST).json({
          message:
            "All modules within the course must be completed to finish the course",
        });
      }

      // Calculate the average completion percentage for the track
      const completedCourses = await StudentCourse.find({
        studentID,
        trackID,
        status: "completed",
      });

      const totalCompletedCourses = completedCourses.length;
      const totalCoursesInTrack = await StudentCourse.countDocuments({
        studentID,
        trackID,
      });

      const completionAverage =
        (totalCompletedCourses / totalCoursesInTrack) * 100;

      // Update the StudentTrack completion_average field and status
      await StudentTrack.updateOne(
        { studentID, trackID },
        {
          $set: {
            completion_average: completionAverage,
            status: "in progress",
          },
        }
      );

      return res.status(HttpCode.OK).json({
        message: "Course completed successfully",
      });
    } catch (error) {
      next(
        new AppError({
          message: "Error completing course",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);
