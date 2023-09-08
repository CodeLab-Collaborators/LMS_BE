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
exports.getOneTrackWithCourses = exports.getTrackWithCourses = exports.addCourseToTrack = exports.deleteTrack = exports.editTracks = exports.getTracks = exports.createTrackService = void 0;
const globalFunctions_1 = require("../../utils/globalFunctions");
const tracks_1 = __importDefault(require("../models/tracks"));
const randomstring_1 = require("randomstring");
const AppError_1 = require("../../utils/AppError");
const trackCourse_1 = __importDefault(require("../models/trackCourse"));
exports.createTrackService = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { trackID, trackName, description, price } = req.body;
    let track;
    const checkTrackExist = yield tracks_1.default.findOne({ trackName });
    if (!checkTrackExist) {
        track = new tracks_1.default({
            trackID: (0, randomstring_1.generate)(6),
            trackName,
            description,
            price,
        });
    }
    else {
        next(new AppError_1.AppError({
            message: "Track already exists",
            httpCode: AppError_1.HttpCode.CONFLICT,
        }));
    }
    const createdTrack = yield track.save();
    return res
        .status(AppError_1.HttpCode.CREATED)
        .json({ message: "track created", createdTrack });
}));
exports.getTracks = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const track = yield tracks_1.default.find().select("-trackID -_id");
    return res.status(AppError_1.HttpCode.OK).json({ message: "All tracks", track });
}));
exports.editTracks = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { trackName, description, price } = req.body;
    const track = yield tracks_1.default.findById(req.params.trackID);
    if (!track) {
        next(new AppError_1.AppError({
            message: "Track does not exist",
            httpCode: AppError_1.HttpCode.NOT_FOUND,
        }));
    }
    track.trackName = trackName || track.trackName;
    track.description = description || track.description;
    track.price = price || track.price;
    const editedTrack = yield track.save({ validateBeforeSave: false });
    return res.status(AppError_1.HttpCode.OK).json({ message: "Success", editedTrack });
}));
exports.deleteTrack = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const track = yield tracks_1.default.findById(req.params.trackID);
    if (!track) {
        next(new AppError_1.AppError({
            message: "Track does not exist",
            httpCode: AppError_1.HttpCode.NOT_FOUND,
        }));
    }
    const deletedTrack = yield track.deleteOne();
    return res.status(AppError_1.HttpCode.OK).json({ message: "Track deleted" });
}));
exports.addCourseToTrack = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseID, trackID } = req.params;
    let newTrackCourse;
    // Check if the track exists
    const existingTrack = yield tracks_1.default.findOne({ trackID });
    // Check if the course is already mapped to the track
    const existingTrackCourse = yield trackCourse_1.default.findOne({
        courseID,
        trackID,
    });
    if (!existingTrack) {
        next(new AppError_1.AppError({
            message: "Track does not exist",
            httpCode: AppError_1.HttpCode.NOT_FOUND,
        }));
        return;
    }
    if (!existingTrackCourse) {
        newTrackCourse = new trackCourse_1.default({
            trackID,
            courseID,
        });
    }
    else {
        next(new AppError_1.AppError({
            message: "Course already exists in Track",
            httpCode: AppError_1.HttpCode.NOT_FOUND,
        }));
    }
    const createdTrackCourse = yield newTrackCourse.save();
    return res
        .status(AppError_1.HttpCode.CREATED)
        .json({ message: "track course created", createdTrackCourse });
}));
const getTrackWithCourses = (trackID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coursesMappedToTrack = yield trackCourse_1.default.aggregate([
            {
                $match: {
                    trackID: trackID,
                },
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "courseID",
                    foreignField: "courseID",
                    as: "course",
                },
            },
            {
                $unwind: "$course",
            },
            {
                $project: {
                    _id: 0,
                    title: "$course.title",
                    description: "$course.description",
                },
            },
        ]);
        return coursesMappedToTrack;
    }
    catch (error) {
        throw error;
    }
});
exports.getTrackWithCourses = getTrackWithCourses;
exports.getOneTrackWithCourses = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { trackID } = req.params;
    try {
        const track = yield tracks_1.default.findOne({ trackID }).select("-trackID -_id");
        const coursesMappedToTrack = yield (0, exports.getTrackWithCourses)(trackID);
        if (coursesMappedToTrack.length === 0) {
            return res.status(AppError_1.HttpCode.NOT_FOUND).json({
                message: "Track not found or has no associated courses",
            });
        }
        return res.status(AppError_1.HttpCode.OK).json({
            message: "Track with courses retrieved successfully",
            track,
            coursesMappedToTrack,
        });
    }
    catch (error) {
        next(new AppError_1.AppError({
            message: "Error retrieving track with courses",
            httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
        }));
    }
}));
