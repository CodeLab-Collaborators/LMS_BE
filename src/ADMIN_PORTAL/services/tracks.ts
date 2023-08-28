import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/globalFunctions";
import Track from "../models/tracks";
import { generate } from "randomstring";
import { AppError, HttpCode } from "../../utils/AppError";
import TrackCourse from "../models/trackCourse";

export const createTrackService = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { trackID, trackName, description, price } = req.body;
    let track;
    const checkTrackExist = await Track.findOne({ trackName });
    if (!checkTrackExist) {
      track = new Track({
        trackID: generate(6),
        trackName,
        description,
        price,
      });
    } else {
      next(
        new AppError({
          message: "Track already exists",
          httpCode: HttpCode.CONFLICT,
        })
      );
    }
    const createdTrack = await track!.save();
    return res
      .status(HttpCode.CREATED)
      .json({ message: "track created", createdTrack });
  }
);

export const getTracks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const track = await Track.find().select("-trackID -_id");
    return res.status(HttpCode.OK).json({ message: "All tracks", track });
  }
);

export const editTracks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { trackName, description, price } = req.body;

    const track = await Track.findById(req.params.trackID);
    if (!track) {
      next(
        new AppError({
          message: "Track does not exist",
          httpCode: HttpCode.NOT_FOUND,
        })
      );
    }

    track!.trackName = trackName || track!.trackName;
    track!.description = description || track!.description;
    track!.price = price || track!.price;

    const editedTrack = await track!.save({ validateBeforeSave: false });

    return res.status(HttpCode.OK).json({ message: "Success", editedTrack });
  }
);

export const deleteTrack = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const track = await Track.findById(req.params.trackID);
    if (!track) {
      next(
        new AppError({
          message: "Track does not exist",
          httpCode: HttpCode.NOT_FOUND,
        })
      );
    }

    const deletedTrack = await track!.deleteOne();
    return res.status(HttpCode.OK).json({ message: "Track deleted" });
  }
);

export const addCourseToTrack = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseID, trackID } = req.body;

    let newTrackCourse;
    // Check if the track exists
    const existingTrack = await Track.findOne({ trackID });

    // Check if the course is already mapped to the track
    const existingTrackCourse = await TrackCourse.findOne({
      courseID,
      trackID,
    });

    if (!existingTrack) {
      next(
        new AppError({
          message: "Track does not exist",
          httpCode: HttpCode.NOT_FOUND,
        })
      );
      return;
    }

    if (!existingTrackCourse) {
      newTrackCourse = new TrackCourse({
        trackID,
        courseID,
      });
    } else {
      next(
        new AppError({
          message: "Course already exists in Track",
          httpCode: HttpCode.NOT_FOUND,
        })
      );
    }

    const createdTrackCourse = await newTrackCourse!.save();
    return res
      .status(HttpCode.CREATED)
      .json({ message: "track course created", createdTrackCourse });
  }
);

export const getTrackWithCourses = async (trackID: string) => {
  try {
    const coursesMappedToTrack = await TrackCourse.aggregate([
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
  } catch (error) {
    throw error;
  }
};

export const getOneTrackWithCourses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { trackID } = req.params;

    try {
      const track = await Track.findOne({ trackID }).select("-trackID -_id");
      const coursesMappedToTrack = await getTrackWithCourses(trackID);

      if (coursesMappedToTrack.length === 0) {
        return res.status(HttpCode.NOT_FOUND).json({
          message: "Track not found or has no associated courses",
        });
      }

      return res.status(HttpCode.OK).json({
        message: "Track with courses retrieved successfully",
        track,
        coursesMappedToTrack,
      });
    } catch (error) {
      next(
        new AppError({
          message: "Error retrieving track with courses",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);
