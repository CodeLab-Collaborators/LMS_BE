import { generate } from "randomstring";
import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/globalFunctions";
import Modules from "../models/modules";
import { AppError, HttpCode } from "../../utils/AppError";

export const createModuleservice = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { moduleID, description, material, title } = req.body;

    try {
      // Check if the module title already exists
      const checkModuleExist = await Modules.findOne({ title });

      if (checkModuleExist) {
        return res.status(HttpCode.CONFLICT).json({
          message: "Module with the same title already exists",
        });
      }

      const module = new Modules({
        moduleID: generate(6),
        title,
        description,
        material,
      });

      const createdModule = await module.save();
      return res
        .status(HttpCode.CREATED)
        .json({ message: "Module created", createdModule });
    } catch (error) {
      next(
        new AppError({
          message: "Error creating module",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const getAllModule = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allModules = await Modules.find();

      return res.status(HttpCode.OK).json({
        message: "All modules retrieved successfully",
        modules: allModules,
      });
    } catch (error) {
      next(
        new AppError({
          message: "Error retrieving modules",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);

export const getAModule = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { moduleID } = req.params;

    try {
      const module = await Modules.findOne({ moduleID });

      if (!module) {
        return res.status(HttpCode.NOT_FOUND).json({
          message: "Module not found",
        });
      }

      return res.status(HttpCode.OK).json({
        message: "Module retrieved successfully",
        module,
      });
    } catch (error) {
      next(
        new AppError({
          message: "Error retrieving module",
          httpCode: HttpCode.INTERNAL_SERVER_ERROR,
        })
      );
    }
  }
);
export const editModule = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, material } = req.body;

    const module = await Modules.findById(req.params.moduleID);
    if (!module) {
      next(
        new AppError({
          message: "modules does not exist",
          httpCode: HttpCode.NOT_FOUND,
        })
      );
    }

    module!.title = title || module!.title;
    module!.description = description || module!.description;
    module!.material = material || module!.material;

    const editmodule = await module!.save({ validateBeforeSave: false });

    return res.status(HttpCode.OK).json({ message: "Success", editmodule });
  }
);

export const deleteModule = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const module = await Modules.findById(req.params.moduleID);
    if (!module) {
      next(
        new AppError({
          message: "modules does not exist",
          httpCode: HttpCode.NOT_FOUND,
        })
      );
    }

    const deletedmodule = await module!.deleteOne();
    return res
      .status(HttpCode.OK)
      .json({ message: "modules deleted", deletedmodule });
  }
);
