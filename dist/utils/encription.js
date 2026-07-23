"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.encrypt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const encrypt = async (password) => {
    return await bcrypt_1.default.hash(password, 10);
};
exports.encrypt = encrypt;
const compare = async (password, hashedPassword) => {
    return await bcrypt_1.default.compare(password, hashedPassword);
};
exports.compare = compare;
//# sourceMappingURL=encription.js.map