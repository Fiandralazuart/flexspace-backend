"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../generated/prisma");
const response_1 = __importDefault(require("../utils/response"));
const prisma = new prisma_1.PrismaClient();
exports.default = {
    async getProvinces(req, res) {
        try {
            const result = await prisma.province.findMany({
                orderBy: {
                    name: "asc",
                },
            });
            if (result.length === 0)
                return response_1.default.notFound(res, "No Province Found");
            response_1.default.success(res, result, "Success Get Provinces");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to get provinces");
        }
    },
    async getRegencies(req, res) {
        try {
            const { provinceId } = req.params;
            if (!provinceId || Array.isArray(provinceId))
                return response_1.default.notFound(res, "User is not found");
            const result = await prisma.regency.findMany({
                where: {
                    provinceId,
                },
                orderBy: {
                    name: "asc",
                },
            });
            if (result.length === 0)
                return response_1.default.notFound(res, "No Regency Found");
            response_1.default.success(res, result, "Success Get Regencies");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to get regencies");
        }
    },
    async getDistricts(req, res) {
        try {
            const { regencyId } = req.params;
            if (!regencyId || Array.isArray(regencyId))
                return response_1.default.notFound(res, "User is not found");
            const result = await prisma.district.findMany({
                where: {
                    regencyId,
                },
                orderBy: {
                    name: "asc",
                },
            });
            if (result.length === 0)
                return response_1.default.notFound(res, "No District Found");
            response_1.default.success(res, result, "Success Get Districts");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to get districts");
        }
    },
    async getVillages(req, res) {
        try {
            const { districtId } = req.params;
            if (!districtId || Array.isArray(districtId))
                return response_1.default.notFound(res, "District is not found");
            const result = await prisma.village.findMany({
                where: {
                    districtId,
                },
                orderBy: {
                    name: "asc",
                },
            });
            if (result.length === 0)
                return response_1.default.notFound(res, "No Village Found");
            response_1.default.success(res, result, "Success Get Villages");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to get villages");
        }
    },
    async findByCity(req, res) {
        try {
            const { name } = req.query;
            if (!name || typeof name !== "string") {
                return response_1.default.notFound(res, "City name is required");
            }
            const result = await prisma.regency.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: "insensitive",
                    },
                },
                include: {
                    province: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: {
                    name: "asc",
                },
            });
            if (result.length === 0) {
                return response_1.default.notFound(res, "No City Found");
            }
            response_1.default.success(res, result, "Success Get Region By City");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to get region by city");
        }
    },
};
//# sourceMappingURL=region.controller.js.map