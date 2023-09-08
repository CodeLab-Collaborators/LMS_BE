"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authroute_1 = __importDefault(require("./STUDENT_PORTAL/route/authroute"));
const trackroute_1 = __importDefault(require("./ADMIN_PORTAL/route/trackroute"));
const courseroute_1 = __importDefault(require("./ADMIN_PORTAL/route/courseroute"));
const studentTrack_1 = __importDefault(require("./STUDENT_PORTAL/route/studentTrack"));
const modulesroute_1 = __importDefault(require("./ADMIN_PORTAL/route/modulesroute"));
const studentCourse_1 = __importDefault(require("./STUDENT_PORTAL/route/studentCourse"));
const studentModule_1 = __importDefault(require("./STUDENT_PORTAL/route/studentModule"));
const assessmentRoutes_1 = __importDefault(require("./ADMIN_PORTAL/route/assessmentRoutes"));
const api = (0, express_1.Router)();
// STUDENT_PORTAL
api
    .use("/students", authroute_1.default)
    .use("/students", studentTrack_1.default)
    .use("/students", studentCourse_1.default)
    .use("/students", studentModule_1.default);
// ADMIN_PORTAL
api
    .use("/admin", trackroute_1.default)
    .use("/admin", courseroute_1.default)
    .use("/admin", modulesroute_1.default)
    .use("/admin", assessmentRoutes_1.default);
exports.default = api;
