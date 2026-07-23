"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const prisma_1 = require("../../generated/prisma");
const building_validation_1 = require("../validations/building.validation");
const prisma = new prisma_1.PrismaClient();
exports.default = {
    async create(req, res) {
        try {
            const io = req.app.get("io");
            const data = building_validation_1.BuildingSchema.parse(req.body);
            const result = await prisma.building.create({
                data: {
                    name: data.name,
                    location: data.location,
                    isPublished: data.isPublished,
                    creator: {
                        connect: {
                            id: req.user.id,
                        },
                    },
                },
            });
            io.emit("buildingCreated", result);
            response_1.default.success(res, result, "Success Create Building");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to create building");
        }
    },
    async findAll(req, res) {
        try {
            const page = Number(req.query.page ?? 1);
            const limit = Number(req.query.limit ?? 10);
            const search = String(req.query.search ?? "");
            const skip = (page - 1) * limit;
            const where = {};
            if (search) {
                where.OR = [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ];
            }
            const [data, totalData] = await prisma.$transaction([
                prisma.building.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: {
                        createdAt: "desc",
                    },
                    include: {
                        creator: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                }),
                prisma.building.count({
                    where,
                }),
            ]);
            response_1.default.success(res, {
                data,
                meta: {
                    page,
                    limit,
                    totalData,
                    totalPage: Math.ceil(totalData / limit),
                },
            }, "Success Get All Building");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to find all building");
        }
    },
    async findOne(req, res) {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id)) {
                return response_1.default.notFound(res, "User is not found");
            }
            const result = await prisma.building.findUnique({
                where: {
                    id,
                },
                include: {
                    creator: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            if (!result) {
                return response_1.default.notFound(res, "Building not found");
            }
            return response_1.default.success(res, result, "Success Get One Building");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to find one building");
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = building_validation_1.updateBuildingSchema.parse(req.body);
            const io = req.app.get("io");
            if (!id || Array.isArray(id))
                return response_1.default.notFound(res, "User is not found");
            const updateData = {};
            if (data.name !== undefined) {
                updateData.name = data.name;
            }
            if (data.location !== undefined) {
                updateData.location = data.location;
            }
            if (data.isPublished !== undefined) {
                updateData.isPublished = data.isPublished;
            }
            updateData.updater = {
                connect: {
                    id: req.user.id,
                },
            };
            const result = await prisma.building.update({
                where: {
                    id,
                },
                data: updateData,
                include: {
                    creator: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    updater: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            io.emit("buildingUpdated", result);
            response_1.default.success(res, result, "Success Update Building");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to update building");
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.params;
            const io = req.app.get("io");
            if (!id || Array.isArray(id))
                return response_1.default.notFound(res, "User is not found");
            const result = await prisma.building.delete({
                where: {
                    id,
                },
            });
            io.emit("buildingDeleted", {
                id: result.id,
            });
            response_1.default.success(res, result, "Success Delete User");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to delete building");
        }
    },
};
//# sourceMappingURL=building.controller.js.map