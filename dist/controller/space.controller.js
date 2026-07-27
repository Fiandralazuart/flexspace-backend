"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const space_validation_1 = require("../validations/space.validation");
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
exports.default = {
    async create(req, res) {
        try {
            const io = req.app.get("io");
            const data = space_validation_1.createSpaceSchema.parse(req.body);
            const result = await prisma.space.create({
                data: {
                    name: data.name,
                    description: data.description,
                    capacity: data.capacity,
                    picture: data.picture,
                    pictureId: data.pictureId,
                    ...(data.floor !== undefined && {
                        floor: data.floor,
                    }),
                    ...(data.status !== undefined && {
                        status: data.status,
                    }),
                    building: {
                        connect: {
                            id: data.buildingId,
                        },
                    },
                    creator: {
                        connect: {
                            id: req.user.id,
                        },
                    },
                },
            });
            io.emit("spaceCreated", result);
            response_1.default.success(res, result, "Success create space");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to create space");
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
                    {
                        building: {
                            name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                ];
            }
            const [data, totalData] = await Promise.all([
                prisma.space.findMany({
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
                        building: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        devices: {
                            select: {
                                id: true,
                                name: true,
                                status: true,
                                serialNumber: true,
                            },
                        },
                    },
                }),
                prisma.space.count({
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
            }, "Success find all data");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed");
        }
    },
    async findOne(req, res) {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id))
                return response_1.default.notFound(res, "Invalid ID");
            const result = await prisma.space.findUnique({
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
                    building: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    devices: {
                        select: {
                            id: true,
                            name: true,
                            status: true,
                            serialNumber: true,
                        },
                    },
                },
            });
            response_1.default.success(res, result, "Success find one data");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed");
        }
    },
    async update(req, res) {
        try {
            const io = req.app.get("io");
            const { id } = req.params;
            const data = space_validation_1.updateSpaceSchema.parse(req.body);
            if (!id || Array.isArray(id))
                return response_1.default.notFound(res, "Invalid ID");
            const updateData = {};
            if (data.name !== undefined) {
                updateData.name = data.name;
            }
            if (data.description !== undefined) {
                updateData.description = data.description;
            }
            if (data.capacity !== undefined) {
                updateData.capacity = data.capacity;
            }
            if (data.picture !== undefined) {
                updateData.picture = data.picture;
            }
            if (data.pictureId !== undefined) {
                updateData.pictureId = data.pictureId;
            }
            if (data.floor !== undefined) {
                updateData.floor = data.floor;
            }
            if (data.status !== undefined) {
                updateData.status = data.status;
            }
            if (data.isPublished !== undefined) {
                updateData.isPublished = data.isPublished;
            }
            if (data.buildingId !== undefined) {
                updateData.building = {
                    connect: {
                        id: data.buildingId,
                    },
                };
            }
            updateData.updater = {
                connect: {
                    id: req.user.id,
                },
            };
            const result = await prisma.space.update({
                where: {
                    id,
                },
                data: updateData,
            });
            io.emit("spaceUpdated", result);
            response_1.default.success(res, result, "Success update space");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed");
        }
    },
    async delete(req, res) {
        try {
            const io = req.app.get("io");
            const { id } = req.params;
            if (!id || Array.isArray(id))
                return response_1.default.notFound(res, "Invalid ID");
            const result = await prisma.space.delete({
                where: {
                    id,
                },
            });
            io.emit("spaceDeleted", {
                id: result.id,
            });
            response_1.default.success(res, result, "Success delete space");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed");
        }
    },
};
//# sourceMappingURL=space.controller.js.map