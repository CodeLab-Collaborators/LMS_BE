"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.creationDate = void 0;
function creationDate() {
    let day = new Date().toDateString();
    let time = new Date().toLocaleTimeString();
    return day + " " + time;
}
exports.creationDate = creationDate;
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.asyncHandler = asyncHandler;
