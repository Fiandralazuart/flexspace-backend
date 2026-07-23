"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_validation_1 = require("../validations/auth.validation");
const prisma_1 = require("../../generated/prisma");
const response_1 = __importDefault(require("../utils/response"));
const encription_1 = require("../utils/encription");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../utils/env");
const jwt_1 = require("../utils/jwt");
const constant_1 = require("../utils/constant");
const prisma = new prisma_1.PrismaClient();
exports.default = {
    async login(req, res) {
        try {
            const data = auth_validation_1.loginSchema.parse(req.body);
            const user = await prisma.user.findUnique({
                where: {
                    email: data.email,
                },
                include: {
                    role: true,
                },
            });
            if (!user) {
                return response_1.default.notFound(res, "Email or password is incorrect");
            }
            const isMatch = (0, encription_1.compare)(data.password, user.password);
            if (!isMatch) {
                return response_1.default.unauthorized(res, "Email or password is incorrect");
            }
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                roleId: user.roleId,
            }, env_1.JWT_SECRET, {
                expiresIn: "1d",
            });
            response_1.default.success(res, {
                token,
                user: {
                    ...user,
                },
            }, "Login success");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed Login");
        }
    },
    async activation(req, res) {
        try {
            const { token } = req.params;
            const data = (0, jwt_1.verifyActivationToken)(token);
            const result = await prisma.user.update({
                where: {
                    id: data.id,
                },
                data: {
                    emailVerified: true,
                },
            });
            return response_1.default.success(res, result, "Account activated successfully");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed Activated User");
        }
    },
    async aboutMe(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return response_1.default.unauthorized(res, "Unauthorized");
            }
            const result = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
                include: {
                    role: true,
                    creator: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    updater: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                omit: constant_1.USER_OMIT,
            });
            if (!result) {
                return response_1.default.notFound(res, "User not found");
            }
            response_1.default.success(res, result, "Success Get Profile");
        }
        catch (error) {
            const err = error;
            response_1.default.error(res, err, "Failed Get Profile");
        }
    },
};
//# sourceMappingURL=auth.controller.js.map