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
            const data = facility_validation_1.createDeviceSchema.parse(req.body);
            const result = await prisma.device.create({
                data: {
                    name: data.name,
                    serialNumber: data.serialNumber,
                    status: "OFFLINE",
                    space: {
                        connect: {
                            id: data.spaceId,
                        },
                    },
                    creator: {
                        connect: {
                            id: req.user.id,
                        },
                    },
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
            io.emit("deviceCreated", result);
            response_1.default.success(res, result, "Success create device");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to create device");
        }
    },
    async findAll(req, res) {
        try {
            const result = await prisma.device.findMany({
                include: {
                    space: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    facilities: true,
                },
            });
            if (result.length === 0)
                return response_1.default.notFound(res, "Database is empty");
            response_1.default.success(res, result, "Success find all data");
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
                return response_1.default.notFound(res, "User is not found");
            const result = await prisma.device.findUnique({
                where: {
                    id,
                },
                include: {
                    space: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    facilities: true,
                },
            });
            if (!result)
                return response_1.default.notFound(res, "Device not found");
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
            const data = facility_validation_1.updateDeviceSchema.parse(req.body);
            const updateData = {};
            if (data.name !== undefined) {
                updateData.name = data.name;
            }
            if (data.serialNumber !== undefined) {
                updateData.serialNumber = data.serialNumber;
            }
            if (data.status !== undefined) {
                updateData.status = data.status;
            }
            if (data.spaceId !== undefined) {
                updateData.space = {
                    connect: {
                        id: data.spaceId,
                    },
                };
            }
            updateData.updater = {
                connect: {
                    id: req.user.id,
                },
            };
            const result = await prisma.device.update({
                where: {
                    id,
                },
                data: updateData,
                include: {
                    space: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    facilities: true,
                },
            });
            io.emit("deviceUpdated", result);
            response_1.default.success(res, result, "Success update device");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to update device");
        }
    },
    async delete(req, res) {
        try {
            const io = req.app.get("io");
            const { id } = req.params;
            if (!id || Array.isArray(id))
                return response_1.default.notFound(res, "User is not found");
            const result = await prisma.device.delete({
                where: {
                    id,
                },
            });
            io.emit("deviceDeleted", {
                id: result.id,
            });
            response_1.default.success(res, result, "Success delete device");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to delete device");
        }
    },
};
//# sourceMappingURL=device.controller.js.map