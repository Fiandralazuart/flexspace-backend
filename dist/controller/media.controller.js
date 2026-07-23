"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const uploader_1 = __importDefault(require("../utils/uploader"));
exports.default = {
    async single(req, res) {
        try {
            console.log("in");
            console.log(req.file);
            if (!req.file)
                return response_1.default.error(res, null, "file are not exist");
            const result = await uploader_1.default.uploadSingle(req.file);
            response_1.default.success(res, result, "Success to upload file");
        }
        catch (error) {
            response_1.default.error(res, error, "Failed to upload file");
        }
    },
    async multiple(req, res) {
        try {
            if (!req.files || req.files.length === 0)
                return response_1.default.error(res, null, "files are not exist");
            const result = await uploader_1.default.uploadMultiple(req.files);
            response_1.default.success(res, result, "Success to upload files");
        }
        catch (error) {
            response_1.default.error(res, error, "Failed to upload files");
        }
    },
    async remove(req, res) {
        try {
            const { fileUrl } = req.body;
            console.log(fileUrl);
            const result = await uploader_1.default.remove(fileUrl);
            response_1.default.success(res, result, "Success to remove file");
        }
        catch (error) {
            response_1.default.error(res, error, "Failed to remove file");
        }
    },
};
//# sourceMappingURL=media.controller.js.map