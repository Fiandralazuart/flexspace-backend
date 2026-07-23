"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../generated/prisma");
const response_1 = __importDefault(require("../utils/response"));
const occupancy_validate_1 = require("../validations/occupancy.validate");
const prisma = new prisma_1.PrismaClient();
exports.default = {
    async create(req, res) {
        try {
            const io = req.app.get("io");
            const data = occupancy_validate_1.createOccupancySchema.parse(req.body);
            const occupancyStatus = data.personCount > 0 ? "OCCUPIED" : "EMPTY";
            await prisma.space.update({
                where: {
                    id: data.spaceId,
                },
                data: {
                    personCount: data.personCount,
                    occupancyStatus,
                    lastDetectedAt: new Date(),
                },
            });
            const result = await prisma.occupancyLog.create({
                data: {
                    space: {
                        connect: {
                            id: data.spaceId,
                        },
                    },
                    personCount: data.personCount,
                    occupancyStatus,
                },
                include: {
                    space: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
            io.emit("occupancyUpdated", result);
            response_1.default.success(res, result, "Success update occupancy");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to update occupancy");
        }
    },
    async findAll(req, res) {
        try {
            const result = await prisma.occupancyLog.findMany({
                include: {
                    space: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: {
                    detectedAt: "desc",
                },
            });
            if (result.length == 0)
                return response_1.default.notFound(res, "Database are empty");
            response_1.default.success(res, result, "Success find all occupancy");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed");
        }
    },
    async findBySpace(req, res) {
        try {
            const { spaceId } = req.params;
            if (!spaceId || Array.isArray(spaceId))
                return response_1.default.notFound(res, "Invalid Space ID");
            const result = await prisma.occupancyLog.findMany({
                where: {
                    spaceId,
                },
                orderBy: {
                    detectedAt: "desc",
                },
            });
            response_1.default.success(res, result, "Success find occupancy");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed");
        }
    },
};
//# sourceMappingURL=occupancy.controller.js.map