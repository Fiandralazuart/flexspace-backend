"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserData = void 0;
const response_1 = __importDefault(require("../utils/response"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../utils/env");
const getUserData = (token) => {
    const user = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
    return user;
};
exports.getUserData = getUserData;
exports.default = (req, res, next) => {
    const authorization = req.headers?.authorization;
    if (!authorization) {
        return response_1.default.unauthorized(res, "unauthorized");
    }
    const [prefix, token] = authorization.split(" ");
    if (!(prefix === "Bearer" && token)) {
        return response_1.default.unauthorized(res, "unauthorized");
    }
    let user;
    try {
        user = (0, exports.getUserData)(token);
    }
    catch (error) {
        return response_1.default.unauthorized(res, "unauthorized");
    }
    if (!user) {
        return response_1.default.unauthorized(res, "unauthorized");
    }
    req.user = user;
    next();
};
//# sourceMappingURL=auth.middleware.js.map