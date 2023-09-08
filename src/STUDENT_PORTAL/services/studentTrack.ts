import { NextFunction, Request, Response } from "express";
import { asyncHandler, creationDate } from "../../utils/globalFunctions";
import Student from "../models/auth";
import StudentTrack from "../models/studentTrack";
import { AppError, HttpCode } from "../../utils/AppError";
import Track from "../../ADMIN_PORTAL/models/tracks";
import { getTrackWithCourses } from "../../ADMIN_PORTAL/services/tracks";

export const enrollTrack = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentID, trackID } = req.params;

    let studentTrack: any;
    // Check if the track exists
    const existingStudent = await Student.findOne({ studentID });
    const existingTrack = await Track.findOne({ trackID });

    // Check if student already enrolled for track
    const existingStudentTrack = await StudentTrack.findOne({
      studentID,
      trackID,
    });

    if (!existingStudent || !existingTrack) {
      next(
        new AppError({
          message: "Track or Student does not exist",
          httpCode: HttpCode.NOT_FOUND,
        })
      );
      return;
    }

    if (!existingStudentTrack) {
      studentTrack = new StudentTrack({
        trackID,
        studentID,
        dateEnrolled: creationDate(),
        status: "Enrolled",
      });
    } else {
      next(
        new AppError({
          message: "Student already enrolled Track",
          httpCode: HttpCode.NOT_FOUND,
        })
      );
    }

    const createdTrackCourse = await studentTrack!.save();
    return res
      .status(HttpCode.CREATED)
      .json({ message: "track course created", createdTrackCourse });
  }
);

const getStudentTracks = async (studentID: string) => {
  try {
    const track = await StudentTrack.aggregate([
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
  } catch (error) {
    throw error;
  }
};
export const getAllEnrolledTrack = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentID } = req.params;
    // Check if the student exists
    const student = await Student.findOne({ studentID }).select(
      "-studentID -_id -password -confirmPassword -isEmailVerified -__v -createdAt"
    );
    const studentTracks = await getStudentTracks(studentID);
    if (!student) {
      return res.status(HttpCode.NOT_FOUND).json({
        message: "Student does not exist",
      });
    }

    if (studentTracks.length === 0) {
      return res.status(HttpCode.NOT_FOUND).json({
        message: "Track not found or has no associated Students",
      });
    }

    return res.status(HttpCode.OK).json({
      message: "Student Tracks retrieved successfully",
      student,
      studentTracks,
    });
  }
);

export const getStudentTrackWithCourses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { studentID, trackID } = req.params;

    // Check if the student exists
    const student = await Student.findOne({ studentID }).select(
      "-studentID -_id -password -confirmPassword -isEmailVerified -__v -createdAt"
    );
    if (!student) {
      return res.status(HttpCode.NOT_FOUND).json({
        message: "Student does not exist",
      });
    }

    try {
      const track = await StudentTrack.findOne({
        studentID,
        trackID,
      }).select("-_id");

      if (!track) {
        return res.status(HttpCode.NOT_FOUND).json({
          message: "Track not found for this student",
        });
      }

      const coursesMappedToTrack = await getTrackWithCourses(trackID);

      if (coursesMappedToTrack.length === 0) {
        return res.status(HttpCode.NOT_FOUND).json({
          message: "Track has no associated courses",
        });
      }
      const totalCoursesInTrack = coursesMappedToTrack.length;

      // Update the studentTrack's total_courses
      await StudentTrack.updateOne(
        { studentID, trackID },
        { $set: { total_courses: totalCoursesInTrack } }
      );
      return res.status(HttpCode.OK).json({
        message: "Student's track with courses retrieved successfully",
        student,
        track,
        coursesMappedToTrack,
      });
    } catch (error) {
      next(
        new AppError({
          message: "Error retrieving student's track with courses",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);
