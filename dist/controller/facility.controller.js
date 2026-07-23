"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../generated/prisma");
const response_1 = __importDefault(require("../utils/response"));
const facility_validation_1 = require("../validations/facility.validation");
const prisma = new prisma_1.PrismaClient();
exports.default = {
    async create(req, res) {
        try {
            const io = req.app.get("io");
            const data = facility_validation_1.createFacilitySchema.parse(req.body);
            const result = await prisma.facility.create({
                data: {
                    name: data.name,
                    type: data.type,
                    status: data.status,
                    channel: data.channel,
                    ...(data.value !== undefined && {
                        value: data.value,
                    }),
                    device: {
                        connect: {
                            id: data.deviceId,
                        },
                    },
                    creator: {
                        connect: {
                            id: req.user.id,
                        },
                    },
                },
                include: {
                    device: {
                        select: {
                            id: true,
                            name: true,
                            serialNumber: true,
                            space: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });
            io.emit("facilityCreated", result);
            response_1.default.success(res, result, "Success create facility");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to create facility");
        }
    },
    async findAll(req, res) {
        try {
            const { search = "", deviceId, page = "1", limit = "10" } = req.query;
            const currentPage = Number(page);
            const take = Number(limit);
            const skip = (currentPage - 1) * take;
            const where = {};
            if (deviceId) {
                where.deviceId = String(deviceId);
            }
            if (search) {
                where.name = {
                    contains: String(search),
                    mode: "insensitive",
                };
            }
            const [data, totalData] = await Promise.all([
                prisma.facility.findMany({
                    where,
                    skip,
                    take,
                    include: {
                        device: {
                            select: {
                                id: true,
                                name: true,
                                serialNumber: true,
                                space: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                }),
                prisma.facility.count({
                    where,
                }),
            ]);
            response_1.default.success(res, {
                data,
                meta: {
                    page: currentPage,
                    limit: take,
                    totalData,
                    totalPage: Math.ceil(totalData / take),
                },
            }, "Success get all data");
        }
        catch (error) {
            response_1.default.error(res, error, "Failed");
        }
    },
    async findOne(req, res) {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id))
                return response_1.default.notFound(res, "User is not found");
            const result = await prisma.facility.findUnique({
                where: {
                    id,
                },
                include: {
                    device: {
                        select: {
                            id: true,
                            name: true,
                            serialNumber: true,
                            space: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!result)
                return response_1.default.notFound(res, "Facility not found");
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
            if (!id || Array.isArray(id))
                return response_1.default.notFound(res, "User is not found");
            const data = facility_validation_1.updateFacilitySchema.parse(req.body);
            const updateData = {};
            if (data.name !== undefined) {
                updateData.name = data.name;
            }
            if (data.type !== undefined) {
                updateData.type = data.type;
            }
            if (data.status !== undefined) {
                updateData.status = data.status;
            }
            if (data.value !== undefined) {
                updateData.value = data.value;
            }
            if (data.deviceId !== undefined) {
                updateData.device = {
                    connect: {
                        id: data.deviceId,
                    },
                };
            }
            updateData.updater = {
                connect: {
                    id: req.user.id,
                },
            };
            const result = await prisma.facility.update({
                where: {
                    id,
                },
                data: updateData,
                include: {
                    device: {
                        select: {
                            id: true,
                            name: true,
                            serialNumber: true,
                            space: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });
            io.emit("facilityUpdated", result);
            response_1.default.success(res, result, "Success update facility");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to update facility");
        }
    },
    async delete(req, res) {
        try {
            const io = req.app.get("io");
            const { id } = req.params;
            if (!id || Array.isArray(id))
                return response_1.default.notFound(res, "User is not found");
            const result = await prisma.facility.delete({
                where: {
                    id,
                },
            });
            io.emit("facilityDeleted", {
                id: result.id,
            });
            response_1.default.success(res, result, "Success delete facility");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to delete facility");
        }
    },
};
//# sourceMappingURL=facility.controller.js.map