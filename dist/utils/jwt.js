"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyActivationToken = exports.createActivationToken = void 0;
const env_1 = require("./env");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createActivationToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, env_1.JWT_SECRET, {
        expiresIn: "1d",
    });
};
exports.createActivationToken = createActivationToken;
const verifyActivationToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
};
exports.verifyActivationToken = verifyActivationToken;
//# sourceMappingURL=jwt.js.map