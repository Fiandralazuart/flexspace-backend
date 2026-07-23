"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = iotMiddleware;
const response_1 = __importDefault(require("../utils/response"));
function iotMiddleware(req, res, next) {
    const apiKey = req.header("x-api-key");
    if (!apiKey) {
        return response_1.default.unauthorized(res, "API Key is required");
    }
    if (apiKey !== process.env.OCCUPANCY_API_KEY) {
        return response_1.default.unauthorized(res, "Invalid API Key");
    }
    next();
}
//# sourceMappingURL=occupancy.middleware.js.map