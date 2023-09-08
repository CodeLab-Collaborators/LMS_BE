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
exports.getOneCourseWithModules = exports.getCourseWithModules = exports.addModulesToCourse = exports.deleteCourse = exports.editCourses = exports.getCourses = exports.createCourseService = void 0;
const randomstring_1 = require("randomstring");
const globalFunctions_1 = require("../../utils/globalFunctions");
const courses_1 = __importDefault(require("../models/courses"));
const AppError_1 = require("../../utils/AppError");
// import Module from "../models/modules";
const CourseModules_1 = __importDefault(require("../models/CourseModules"));
exports.createCourseService = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseID, description, title, imgcover } = req.body;
    const checkCourseExist = yield courses_1.default.findOne({ title });
    if (checkCourseExist) {
        next(new AppError_1.AppError({
            message: "Courses already exists",
            httpCode: AppError_1.HttpCode.CONFLICT,
        }));
    }
    const course = new courses_1.default({
        courseID: (0, randomstring_1.generate)(6),
        title,
        description,
        imgcover,
    });
    const createdCourse = yield course.save();
    return res
        .status(AppError_1.HttpCode.CREATED)
        .json({ message: "course created", createdCourse });
}));
exports.getCourses = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield courses_1.default.find().select("-_id -courseID");
    return res.status(AppError_1.HttpCode.OK).json({ message: "All courses", course });
}));
exports.editCourses = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, imgcover } = req.body;
    const course = yield courses_1.default.findById(req.params.courseID);
    if (!course) {
        next(new AppError_1.AppError({
            message: "Courses does not exist",
            httpCode: AppError_1.HttpCode.NOT_FOUND,
        }));
    }
    course.title = title || course.title;
    course.description = description || course.description;
    course.imgcover = imgcover || course.imgcover;
    const editCourse = yield course.save({ validateBeforeSave: false });
    return res.status(AppError_1.HttpCode.OK).json({ message: "Success", editCourse });
}));
exports.deleteCourse = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield courses_1.default.findById(req.params.courseID);
    if (!course) {
        next(new AppError_1.AppError({
            message: "Courses does not exist",
            httpCode: AppError_1.HttpCode.NOT_FOUND,
        }));
    }
    const deletedCourse = yield course.deleteOne();
    return res
        .status(AppError_1.HttpCode.OK)
        .json({ message: "Courses deleted", deletedCourse });
}));
exports.addModulesToCourse = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseID, moduleID } = req.params;
    let newCourseModule;
    // Check if the course exists
    const existingCourse = yield courses_1.default.findOne({ courseID });
    // Check if the Module is already mapped to the Course
    const existingCourseModule = yield CourseModules_1.default.findOne({
        courseID,
        moduleID,
    });
    if (!existingCourse) {
        next(new AppError_1.AppError({
            message: "Course does not exist",
            httpCode: AppError_1.HttpCode.NOT_FOUND,
        }));
        return;
    }
    if (!existingCourseModule) {
        newCourseModule = new CourseModules_1.default({
            moduleID,
            courseID,
            created: new Date().toISOString(),
        });
    }
    else {
        next(new AppError_1.AppError({
            message: "Module already exists in Course",
            httpCode: AppError_1.HttpCode.NOT_FOUND,
        }));
    }
    const createdCourseModule = yield newCourseModule.save();
    return res
        .status(AppError_1.HttpCode.CREATED)
        .json({ message: " course modules created", createdCourseModule });
}));
const getCourseWithModules = (courseID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ModulesMappedToCourse = yield CourseModules_1.default.aggregate([
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
    }
    catch (error) {
        throw error;
    }
});
exports.getCourseWithModules = getCourseWithModules;
exports.getOneCourseWithModules = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseID } = req.params;
    try {
        const course = yield courses_1.default.findOne({ courseID });
        const ModulesMappedToCourse = yield (0, exports.getCourseWithModules)(courseID);
        if (ModulesMappedToCourse.length === 0) {
            return res.status(AppError_1.HttpCode.NOT_FOUND).json({
                message: "Course not found or has no associated modules",
            });
        }
        return res.status(AppError_1.HttpCode.OK).json({
            message: "Course with modules retrieved successfully",
            course,
            ModulesMappedToCourse,
        });
    }
    catch (error) {
        next(new AppError_1.AppError({
            message: "Error retrieving course with modules",
            httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
        }));
    }
}));
