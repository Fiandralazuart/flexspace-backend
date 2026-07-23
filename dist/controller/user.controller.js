"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_validation_1 = require("../validations/user.validation");
const prisma_1 = require("../../generated/prisma");
const response_1 = __importDefault(require("../utils/response"));
const encription_1 = require("../utils/encription");
const mail_service_1 = require("../services/mail.service");
const cuid_1 = __importDefault(require("cuid"));
const constant_1 = require("../utils/constant");
const prisma = new prisma_1.PrismaClient();
exports.default = {
    async createUser(req, res) {
        try {
            const io = req.app.get("io");
            const data = user_validation_1.createUserSchema.parse(req.body);
            const result = await prisma.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    roleId: data.roleId,
                    phone: data.phone ?? null,
                    password: await (0, encription_1.encrypt)(data.password),
                    createdBy: req.user.id,
                },
                omit: constant_1.USER_OMIT
            });
            await (0, mail_service_1.sendActivationEmail)(result);
            io.emit("userCreated", result);
            response_1.default.success(res, result, "Success Create User");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed Create User");
        }
    },
    async findUser(req, res) {
        try {
            const result = await prisma.user.findMany({
                include: {
                    creator: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
                omit: constant_1.USER_OMIT
            });
            if (result.length == 0) {
                return response_1.default.notFound(res, "No Data Found");
            }
            response_1.default.success(res, result, "Success Get All Data");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to findUser");
        }
    },
    async findUserById(req, res) {
        try {
            const { id } = req.params;
            if (!id || Array.isArray(id))
                return response_1.default.notFound(res, "User is not found");
            const result = await prisma.user.findUnique({
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
                omit: constant_1.USER_OMIT
            });
            if (!result)
                return response_1.default.notFound(res, "Data Not Found");
            response_1.default.success(res, result, "Success Get one Data");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to findUserById");
        }
    },
    async updateUser(req, res) {
        try {
            const io = req.app.get("io");
            const { id } = req.params;
            const { name, phone, roleId } = req.body;
            const data = user_validation_1.updateUserSchema.parse({
                name,
                phone,
                roleId,
            });
            if (!id || Array.isArray(id))
                return response_1.default.notFound(res, "User is not found");
            const updateData = {};
            if (data.name !== undefined) {
                updateData.name = data.name;
            }
            if (data.phone !== undefined) {
                updateData.phone = data.phone;
            }
            if (data.roleId !== undefined) {
                updateData.role = {
                    connect: {
                        id: data.roleId,
                    },
                };
            }
            updateData.updater = {
                connect: {
                    id: req.user.id,
                },
            };
            const result = await prisma.user.update({
                where: { id },
                data: updateData,
                omit: constant_1.USER_OMIT
            });
            io.emit("userUpdated", {
                id: result.id,
                name: result.name,
                phone: result.phone,
                roleId: result.roleId
            });
            response_1.default.success(res, result, "Success Update User");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to Update User");
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.params;
            const io = req.app.get("io");
            if (!id || Array.isArray(id))
                return response_1.default.notFound(res, "User is not found");
            const result = await prisma.user.delete({
                where: {
                    id,
                },
                omit: constant_1.USER_OMIT
            });
            io.emit("userDeleted", {
                id: result.id
            });
            response_1.default.success(res, result, "Success Delete User");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed to Delete User");
        }
    },
    async createGeneralUser(req, res) {
        try {
            const io = req.app.get("io");
            const data = user_validation_1.createGeneralUserSchema.parse(req.body);
            const id = (0, cuid_1.default)();
            const result = await prisma.user.create({
                data: {
                    id,
                    name: data.name,
                    email: data.email,
                    roleId: 4,
                    phone: data.phone ?? null,
                    password: await (0, encription_1.encrypt)(data.password),
                    createdBy: id,
                },
                omit: constant_1.USER_OMIT
            });
            await (0, mail_service_1.sendActivationEmail)(result);
            io.emit("generalUserCreated", result);
            response_1.default.success(res, result, "Success Create General User");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed Create User");
        }
    },
};
//# sourceMappingURL=user.controller.js.map