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
exports.deleteModule = exports.editModule = exports.getAModule = exports.getAllModule = exports.createModuleservice = void 0;
const randomstring_1 = require("randomstring");
const globalFunctions_1 = require("../../utils/globalFunctions");
const modules_1 = __importDefault(require("../models/modules"));
const AppError_1 = require("../../utils/AppError");
exports.createModuleservice = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { moduleID, description, material, title } = req.body;
    try {
        // Check if the module title already exists
        const checkModuleExist = yield modules_1.default.findOne({ title });
        if (checkModuleExist) {
            return res.status(AppError_1.HttpCode.CONFLICT).json({
                message: "Module with the same title already exists",
            });
        }
        const module = new modules_1.default({
            moduleID: (0, randomstring_1.generate)(6),
            title,
            description,
            material,
        });
        const createdModule = yield module.save();
        return res
            .status(AppError_1.HttpCode.CREATED)
            .json({ message: "Module created", createdModule });
    }
    catch (error) {
        next(new AppError_1.AppError({
            message: "Error creating module",
            httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
        }));
    }
}));
exports.getAllModule = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allModules = yield modules_1.default.find();
        return res.status(AppError_1.HttpCode.OK).json({
            message: "All modules retrieved successfully",
            modules: allModules,
        });
    }
    catch (error) {
        next(new AppError_1.AppError({
            message: "Error retrieving modules",
            httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
        }));
    }
}));
exports.getAModule = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { moduleID } = req.params;
    try {
        const module = yield modules_1.default.findOne({ moduleID });
        if (!module) {
            return res.status(AppError_1.HttpCode.NOT_FOUND).json({
                message: "Module not found",
            });
        }
        return res.status(AppError_1.HttpCode.OK).json({
            message: "Module retrieved successfully",
            module,
        });
    }
    catch (error) {
        next(new AppError_1.AppError({
            message: "Error retrieving module",
            httpCode: AppError_1.HttpCode.INTERNAL_SERVER_ERROR,
        }));
    }
}));
exports.editModule = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, material } = req.body;
    const module = yield modules_1.default.findById(req.params.moduleID);
    if (!module) {
        next(new AppError_1.AppError({
            message: "modules does not exist",
            httpCode: AppError_1.HttpCode.NOT_FOUND,
        }));
    }
    module.title = title || module.title;
    module.description = description || module.description;
    module.material = material || module.material;
    const editmodule = yield module.save({ validateBeforeSave: false });
    return res.status(AppError_1.HttpCode.OK).json({ message: "Success", editmodule });
}));
exports.deleteModule = (0, globalFunctions_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const module = yield modules_1.default.findById(req.params.moduleID);
    if (!module) {
        next(new AppError_1.AppError({
            message: "modules does not exist",
            httpCode: AppError_1.HttpCode.NOT_FOUND,
        }));
    }
    const deletedmodule = yield module.deleteOne();
    return res
        .status(AppError_1.HttpCode.OK)
        .json({ message: "modules deleted", deletedmodule });
}));
