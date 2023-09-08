"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const trackSchema = new mongoose_1.Schema({
    trackID: { type: String },
    trackName: { type: String },
    description: { type: String },
    price: { type: Number },
}, { versionKey: false });
const Track = (0, mongoose_1.model)("Track", trackSchema);
exports.default = Track;
