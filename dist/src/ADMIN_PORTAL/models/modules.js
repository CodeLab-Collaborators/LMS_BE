"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const moduleSchema = new mongoose_1.Schema({
    moduleID: { type: String },
    material: { type: String },
    description: { type: String },
    title: { type: String },
}, { versionKey: false });
const Module = (0, mongoose_1.model)("Module", moduleSchema);
exports.default = Module;
