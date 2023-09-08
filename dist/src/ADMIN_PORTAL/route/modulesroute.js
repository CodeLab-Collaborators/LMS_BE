"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const modules_1 = require("../controller/modules");
const moduleRouter = (0, express_1.Router)();
moduleRouter.post("/module", modules_1.createModuleController);
moduleRouter.get("/module", modules_1.getAllModuleController);
moduleRouter.get("/module/:moduleID", modules_1.getAModuleController);
moduleRouter.delete("/module/:moduleID", modules_1.deleteModuleController);
moduleRouter.patch("/module/:moduleID", modules_1.editModuleController);
exports.default = moduleRouter;
