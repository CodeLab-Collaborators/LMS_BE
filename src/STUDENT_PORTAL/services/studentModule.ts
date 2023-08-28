import { asyncHandler } from "../../utils/globalFunctions";
import { AppError, HttpCode } from "../../utils/AppError";
import { NextFunction, Request, Response } from "express";
import CourseModule from "../../ADMIN_PORTAL/models/CourseModules";
import StudentModule from "../models/studentModule";
import StudentCourse from "../models/studentCourse";
import Module from "../../ADMIN_PORTAL/models/modules";
import StudentTrack from "../models/studentTrack";

export const startModule = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentID, courseID, moduleID } = req.params;

    try {
      const previousModule = await StudentModule.findOne({
        studentID,
        courseID,
        status: { $ne: "completed" },
      }).sort({ startDate: -1 }); // Sort by startDate in descending order

      if (previousModule) {
        return res.status(HttpCode.BAD_REQUEST).json({
          message: "You are required to complete previous module",
        });
      }

      const existingModule = await StudentModule.findOne({
        studentID,
        courseID,
        moduleID,
      });

      if (existingModule) {
        if (existingModule.status === "completed") {
          return res.status(HttpCode.BAD_REQUEST).json({
            message: "Module has already been completed by this student",
          });
        } else {
          return res.status(HttpCode.BAD_REQUEST).json({
            message: "Module is already started for this student",
          });
        }
      }

      const module = await CourseModule.findOne({ courseID, moduleID });
      if (!module) {
        return res.status(HttpCode.NOT_FOUND).json({
          message: "Module not found for this course",
        });
      }

      const studentModule = new StudentModule({
        studentID,
        courseID,
        moduleID,
        status: "in progress",
        startDate: new Date().toISOString(),
      });
      await studentModule.save();

      await StudentCourse.updateOne(
        { studentID, courseID },
        { $set: { status: "in progress" } }
      );

      return res.status(HttpCode.OK).json({
        message: "Module started successfully",
        studentModule,
      });
    } catch (error) {
      next(
        new AppError({
          message: "Error starting module",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

// This function calculates and updates the completion average for a student track
async function updateTrackCompletionAverage(
  studentID: string,
  trackID: string
) {
  const completedCourses = await StudentCourse.find({
    studentID,
    trackID,
    status: "completed",
  });

  const inProgressCourses = await StudentCourse.find({
    studentID,
    trackID,
    status: "in progress",
  });
  const startedCourses = await StudentCourse.find({
    studentID,
    trackID,
    status: "started",
  });

  const totalCourses =
    completedCourses.length + inProgressCourses.length + startedCourses.length;

  // Check if all StudentModules in all StudentCourses are completed
  const allModulesCompleted = await StudentModule.find({
    studentID,
    courseID: { $in: completedCourses.map((course) => course.courseID) },
    status: { $ne: "completed" },
  });

  // Update the StudentTrack status to "completed" if conditions are met
  if (
    allModulesCompleted.length === 0 &&
    inProgressCourses.length === 0 &&
    startedCourses.length === 0
  ) {
    await StudentTrack.updateOne(
      { studentID, trackID },
      { $set: { completion_average: 100, status: "completed" } }
    );
  } else {
    // Calculate the completion_average
    const completionSum = completedCourses.reduce(
      (sum, course) => sum + course.completion_average,
      0
    );
    const newCompletionAverage =
      totalCourses > 0 ? completionSum / totalCourses : 0;

    // Update the StudentTrack completion_average
    await StudentTrack.updateOne(
      { studentID, trackID },
      { $set: { completion_average: newCompletionAverage } }
    );
  }
}

export const completeModule = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentID, courseID, moduleID, trackID } = req.params;

    try {
      // Check if the module was started by the student
      const startedModule = await StudentModule.findOne({
        studentID,
        courseID,
        moduleID,
      });

      if (startedModule?.status === "completed") {
        return res.status(HttpCode.OK).json({
          message: "Module was already completed",
        });
      }
      if (startedModule?.status !== "in progress") {
        return res.status(HttpCode.BAD_REQUEST).json({
          message: "Module was not started by the student",
        });
      }

      // Update StudentModule status to "completed"
      await StudentModule.updateOne(
        { studentID, courseID, moduleID },
        { $set: { status: "completed" } }
      );

      // Check if all modules in the course are completed
      const allModulesCompleted = await StudentModule.find({
        studentID,
        courseID,
        status: { $ne: "completed" }, // Check if any module is not completed
      });

      // Check if all modules in the course are completed
      const courseModules = await CourseModule.find({ courseID });
      const completedModuleIDs = allModulesCompleted.map(
        (module) => module.moduleID
      );
      const allCourseModulesCompleted = courseModules.every((module) =>
        completedModuleIDs.includes(module.moduleID)
      );

      if (allCourseModulesCompleted) {
        // All modules in the course are completed, set StudentCourse status to "completed"
        await StudentCourse.updateOne(
          { studentID, courseID },
          { $set: { status: "completed" } }
        );
      } else {
        // Some modules in the course are still in progress, set StudentCourse status to "in progress"
        await StudentCourse.updateOne(
          { studentID, courseID },
          { $set: { status: "in progress" } }
        );
      }

      // Calculate average completion percentage for the course
      const completedModules = await StudentModule.countDocuments({
        studentID,
        courseID,
        status: "completed",
      });
      const totalModules = await CourseModule.countDocuments({ courseID });
      const completionAverage = (completedModules / totalModules) * 100;

      // Update StudentCourse completion_average
      await StudentCourse.updateOne(
        { studentID, courseID },
        { $set: { completion_average: completionAverage } }
      );

      // Update the StudentTrack completion_average
      await updateTrackCompletionAverage(studentID, trackID);

      return res.status(HttpCode.OK).json({
        message: "Module completed successfully",
      });
    } catch (error) {
      next(
        new AppError({
          message: "Error completing module",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

// export const completeModule = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { studentID, courseID, moduleID, trackID } = req.params;

//     try {
//       // Check if the module was started by the student
//       const startedModule = await StudentModule.findOne({
//         studentID,
//         courseID,
//         moduleID,
//       });

//       if (startedModule?.status === "completed") {
//         return res.status(HttpCode.OK).json({
//           message: "Module was already completed",
//         });
//       }
//       if (startedModule?.status !== "in progress") {
//         return res.status(HttpCode.BAD_REQUEST).json({
//           message: "Module was not started by the student",
//         });
//       }

//       // Update StudentModule status to "completed"
//       await StudentModule.updateOne(
//         { studentID, courseID, moduleID },
//         { $set: { status: "completed" } }
//       );

//       const allModulesCompleted = await StudentModule.find({
//         studentID,
//         courseID,
//         status: { $ne: "completed" }, // Check if any module is not completed
//       });
//       if (allModulesCompleted.length === 0) {
//         // All modules in the course are completed, set StudentCourse status to "completed"
//         await StudentCourse.updateOne(
//           { studentID, courseID },
//           { $set: { status: "completed" } }
//         );
//       } else {
//         // Some modules in the course are still in progress, set StudentCourse status to "in progress"
//         await StudentCourse.updateOne(
//           { studentID, courseID },
//           { $set: { status: "in progress" } }
//         );
//       }

//       // Calculate average completion percentage for the course
//       const completedModules = await StudentModule.countDocuments({
//         studentID,
//         courseID,
//         status: "completed",
//       });
//       const totalModules = await CourseModule.countDocuments({ courseID });
//       const completionAverage = (completedModules / totalModules) * 100;

//       // Update StudentCourse completion_average
//       await StudentCourse.updateOne(
//         { studentID, courseID },
//         { $set: { completion_average: completionAverage } }
//       );

//       // Update the StudentTrack completion_average
//       await updateTrackCompletionAverage(studentID, trackID);

//       return res.status(HttpCode.OK).json({
//         message: "Module completed successfully",
//       });
//     } catch (error) {
//       next(
//         new AppError({
//           message: "Error completing module",
//           httpCode: HttpCode.INTERNAL_SERVER_ERROR,
//         })
//       );
//     }
//   }
// );

export const getStudentModule = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentID, courseID, moduleID } = req.params;

    try {
      const studentModule = await StudentModule.findOne({
        studentID,
        courseID,
        moduleID,
      });

      if (!studentModule) {
        return res.status(HttpCode.NOT_FOUND).json({
          message: "Student module not found",
        });
      }

      const coursemodule = await CourseModule.findOne({ courseID, moduleID });

      if (!coursemodule) {
        return res.status(HttpCode.NOT_FOUND).json({
          message: "Module not found for this course",
        });
      }
      const module = await Module.findOne({ moduleID });

      if (!module) {
        return res.status(HttpCode.NOT_FOUND).json({
          message: "Module not found for this course",
        });
      }

      return res.status(HttpCode.OK).json({
        message: "Student module details retrieved successfully",
        studentModule,
        module,
      });
    } catch (error) {
      next(
        new AppError({
          message: "Error retrieving student module details",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

// const aggregateCourseModule = async (
//   studentID: string,
//   courseID: string,
//   moduleID: string
// ): Promise<any> => {
//   try {
//     const studentModules = await StudentModule.aggregate([
//       {
//         $match: {
//           studentID,
//           courseID,
//           moduleID,
//         },
//       },
//       {
//         $lookup: {
//           from: "coursemodules",
//           let: { moduleID: "$moduleID", courseID: "$courseID" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$moduleID", "$$moduleID"] },
//                     { $eq: ["$courseID", "$$courseID"] },
//                   ],
//                 },
//               },
//             },
//             {
//               $project: {
//                 _id: 0,
//                 title: "$title",
//                 description: "$description",
//                 moduleMaterial: "$material",
//               },
//             },
//           ],
//           as: "moduleDetails",
//         },
//       },
//       {
//         $unwind: "$moduleDetails",
//       },
//       {
//         $project: {
//           _id: 0,
//           studentID: 1,
//           courseID: 1,
//           moduleID: 1,
//           status: 1,
//           startDate: 1,
//           moduleDetails: 1,
//         },
//       },
//     ]);
//     return studentModules;
//   } catch (error) {
//     return error;
//   }
// };
// export const getStudentModule = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { studentID, courseID, moduleID } = req.params;

//     try {
//       const studentModuleDetails = await aggregateCourseModule(
//         studentID,
//         courseID,
//         moduleID
//       );

//       console.log(studentModuleDetails);
//       if (studentModuleDetails!.length === 0) {
//         return res.status(HttpCode.NOT_FOUND).json({
//           message: "Student module not found",
//         });
//       }

//       return res.status(HttpCode.OK).json({
//         message: "Student module details retrieved successfully",
//         studentModuleDetails: studentModuleDetails[0],
//       });
//     } catch (error) {
//       next(
//         new AppError({
//           message: "Error retrieving student module details",
//           httpCode: HttpCode.INTERNAL_SERVER_ERROR,
//         })
//       );
//     }
//   }
// );
