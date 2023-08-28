import { generate } from "randomstring";
import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/globalFunctions";
import Courses from "../models/courses";
import { AppError, HttpCode } from "../../utils/AppError";
// import Module from "../models/modules";
import CourseModule from "../models/CourseModules";

export const createCourseService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseID, description, title, imgCover } = req.body;

    const checkCourseExist = await Courses.findOne({ title });
    if (checkCourseExist) {
      next(
        new AppError({
          message: "Courses already exists",
          httpCode: HttpCode.CONFLICT,
        })
      );
    }
    const course = new Courses({
      courseID: generate(6),
      title,
      description,
      imgCover,
    });
    const createdCourse = await course.save();
    return res
      .status(HttpCode.CREATED)
      .json({ message: "course created", createdCourse });
  }
);

export const getCourses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const course = await Courses.find().select("-_id -courseID");
    return res.status(HttpCode.OK).json({ message: "All courses", course });
  }
);

export const editCourses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, imgCover } = req.body;

    const course = await Courses.findById(req.params.courseID);
    if (!course) {
      next(
        new AppError({
          message: "Courses does not exist",
          httpCode: HttpCode.NOT_FOUND,
        })
      );
    }

    course!.title = title || course!.title;
    course!.description = description || course!.description;
    course!.imgCover = imgCover || course!.imgCover;

    const editCourse = await course!.save({ validateBeforeSave: false });

    return res.status(HttpCode.OK).json({ message: "Success", editCourse });
  }
);

export const deleteCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const course = await Courses.findById(req.params.courseID);
    if (!course) {
      next(
        new AppError({
          message: "Courses does not exist",
          httpCode: HttpCode.NOT_FOUND,
        })
      );
    }

    const deletedCourse = await course!.deleteOne();
    return res
      .status(HttpCode.OK)
      .json({ message: "Courses deleted", deletedCourse });
  }
);

export const addModulesToCourse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseID, moduleID } = req.params;

    let newCourseModule;
    // Check if the course exists
    const existingCourse = await Courses.findOne({ courseID });

    // Check if the Module is already mapped to the Course
    const existingCourseModule = await CourseModule.findOne({
      courseID,
      moduleID,
    });

    if (!existingCourse) {
      next(
        new AppError({
          message: "Course does not exist",
          httpCode: HttpCode.NOT_FOUND,
        })
      );
      return;
    }
    if (!existingCourseModule) {
      newCourseModule = new CourseModule({
        moduleID,
        courseID,
        created: new Date().toISOString(),
      });
    } else {
      next(
        new AppError({
          message: "Module already exists in Course",
          httpCode: HttpCode.NOT_FOUND,
        })
      );
    }

    const createdCourseModule = await newCourseModule!.save();
    return res
      .status(HttpCode.CREATED)
      .json({ message: " course modules created", createdCourseModule });
  }
);

export const getCourseWithModules = async (courseID: string) => {
  try {
    const ModulesMappedToCourse = await CourseModule.aggregate([
      {
        $match: {
          courseID: courseID,
        },
      },
      {
        $lookup: {
          from: "modules",
          localField: "moduleID",
          foreignField: "moduleID",
          as: "module",
        },
      },
      {
        $unwind: "$module",
      },

      {
        $project: {
          _id: 0,
          title: "$module.title",
          description: "$module.description",
          moduleMaterial: "$module.material",
          created: "$module.created",
        },
      },
      {
        $sort: {
          created: 1, // 1 for ascending order, -1 for descending order
        },
      },
    ]);

    return ModulesMappedToCourse;
  } catch (error) {
    throw error;
  }
};

export const getOneCourseWithModules = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseID } = req.params;

    try {
      const course = await Courses.findOne({ courseID });

      const ModulesMappedToCourse = await getCourseWithModules(courseID);

      if (ModulesMappedToCourse.length === 0) {
        return res.status(HttpCode.NOT_FOUND).json({
          message: "Course not found or has no associated modules",
        });
      }

      return res.status(HttpCode.OK).json({
        message: "Course with modules retrieved successfully",
        course,
        ModulesMappedToCourse,
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
