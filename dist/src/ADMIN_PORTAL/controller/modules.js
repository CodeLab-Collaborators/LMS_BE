"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteModuleController = exports.editModuleController = exports.getAModuleController = exports.getAllModuleController = exports.createModuleController = void 0;
const modules_1 = require("../services/modules");
const createModuleController = (req, res, next) => (0, modules_1.createModuleservice)(req, res, next);
exports.createModuleController = createModuleController;
const getAllModuleController = (req, res, next) => (0, modules_1.getAllModule)(req, res, next);
exports.getAllModuleController = getAllModuleController;
const getAModuleController = (req, res, next) => (0, modules_1.getAModule)(req, res, next);
exports.getAModuleController = getAModuleController;
const editModuleController = (req, res, next) => (0, modules_1.editModule)(req, res, next);
exports.editModuleController = editModuleController;
const deleteModuleController = (req, res, next) => (0, modules_1.deleteModule)(req, res, next);
exports.deleteModuleController = deleteModuleController;
