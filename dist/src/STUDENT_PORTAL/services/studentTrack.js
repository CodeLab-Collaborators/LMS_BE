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
exports.getStudentTrackWithCourses = exports.getAllEnrolledTrack = exports.enrollTrack = void 0;
const globalFunctions_1 = require("../../utils/globalFunctions");
const auth_1 = __importDefault(require("../models/auth"));
const studentTrack_1 = __importDefault(require("../models/studentTrack"));
const AppError_1 = require("../../utils/AppError");
const tracks_1 = __importDefault(require("../../ADMIN_PORTAL/models/tracks"));
const tracks_2 = require("../../ADMIN_PORTAL/services/tracks");
exports.enrollTrack = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentID, trackID } = req.params;
    let studentTrack;
    // Check if the track exists
    const existingStudent = yield auth_1.default.findOne({ studentID });
    const existingTrack = yield tracks_1.default.findOne({ trackID });
    // Check if student already enrolled for track
    const existingStudentTrack = yield studentTrack_1.default.findOne({
        studentID,
        trackID,
    });
    if (!existingStudent || !existingTrack) {
        next(new AppError_1.AppError({
            message: "Track or Student does not exist",
            httpCode: AppError_1.HttpCode.NOT_FOUND,
        }));
        return;
    }
    if (!existingStudentTrack) {
        studentTrack = new studentTrack_1.default({
            trackID,
            studentID,
            dateEnrolled: (0, globalFunctions_1.creationDate)(),
            status: "Enrolled",
        });
    }
    else {
        next(new AppError_1.AppError({
            message: "Student already enrolled Track",
            httpCode: AppError_1.HttpCode.NOT_FOUND,
        }));
    }
    const createdTrackCourse = yield studentTrack.save();
    return res
        .status(AppError_1.HttpCode.CREATED)
        .json({ message: "track course created", createdTrackCourse });
}));
const getStudentTracks = (studentID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const track = yield studentTrack_1.default.aggregate([
            {
                $match: {
                    studentID: studentID,
                },
            },
            {
                $lookup: {
                    from: "tracks",
                    localField: "trackID",
                    foreignField: "trackID",
                    as: "track",
                },
            },
            {
                $unwind: "$track",
            },
            {
                $project: {
                    _id: 0,
                    title: "$track.trackName",
                    description: "$track.description",
                    status: "$track.status",
                },
            },
        ]);
        return track;
    }
    catch (error) {
        throw error;
    }
});
exports.getAllEnrolledTrack = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentID } = req.params;
    // Check if the student exists
    const student = yield auth_1.default.findOne({ studentID }).select("-studentID -_id -password -confirmPassword -isEmailVerified -__v -createdAt");
    const studentTracks = yield getStudentTracks(studentID);
    if (!student) {
        return res.status(AppError_1.HttpCode.NOT_FOUND).json({
            message: "Student does not exist",
        });
    }
    if (studentTracks.length === 0) {
        return res.status(AppError_1.HttpCode.NOT_FOUND).json({
            message: "Track not found or has no associated Students",
        });
    }
    return res.status(AppError_1.HttpCode.OK).json({
        message: "Student Tracks retrieved successfully",
        student,
        studentTracks,
    });
}));
exports.getStudentTrackWithCourses = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentID, trackID } = req.params;
    // Check if the student exists
    const student = yield auth_1.default.findOne({ studentID }).select("-studentID -_id -password -confirmPassword -isEmailVerified -__v -createdAt");
    if (!student) {
        return res.status(AppError_1.HttpCode.NOT_FOUND).json({
            message: "Student does not exist",
        });
    }
    try {
        const track = yield studentTrack_1.default.findOne({
            studentID,
            trackID,
        }).select("-_id");
        if (!track) {
            return res.status(AppError_1.HttpCode.NOT_FOUND).json({
                message: "Track not found for this student",
            });
        }
        const coursesMappedToTrack = yield (0, tracks_2.getTrackWithCourses)(trackID);
        if (coursesMappedToTrack.length === 0) {
            return res.status(AppError_1.HttpCode.NOT_FOUND).json({
                message: "Track has no associated courses",
            });
        }
        const totalCoursesInTrack = coursesMappedToTrack.length;
        // Update the studentTrack's total_courses
        yield studentTrack_1.default.updateOne({ studentID, trackID }, { $set: { total_courses: totalCoursesInTrack } });
        return res.status(AppError_1.HttpCode.OK).json({
            message: "Student's track with courses retrieved successfully",
            student,
            track,
            coursesMappedToTrack,
        });
    }
    catch (error) {
        next(new AppError_1.AppError({
            message: "Error retrieving student's track with courses",
            httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
        }));
    }
}));
