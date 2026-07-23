"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const prisma_1 = require("../../generated/prisma");
const response_1 = __importDefault(require("../utils/response"));
const prisma = new prisma_1.PrismaClient();
exports.default = {
    async control(req, res) {
        try {
            const io = req.app.get("io");
            const { id } = req.params;
            const { state, value } = req.body;
            if (!id || Array.isArray(id))
                return response_1.default.notFound(res, "Facility is not found");
            const facility = await prisma.facility.findUnique({
                where: {
                    id,
                },
                include: {
                    device: true,
                },
            });
            if (!facility) {
                return response_1.default.notFound(res, "Facility not found");
            }
            // Payload ke Backend IoT
            const payload = {
                type: facility.type === "AIR_CONDITIONER"
                    ? "AC"
                    : "LIGHT",
                channel: facility.channel, // nanti ganti menjadi facility.channel
                state,
                ...(value !== undefined && { value }),
            };
            const iotResponse = await axios_1.default.post(`${process.env.IOT_API_URL}/esp/${facility.device.serialNumber}`, payload);
            if (!iotResponse.data.success) {
                return response_1.default.error(res, null, iotResponse.data.message ??
                    "Failed to control device");
            }
            const result = await prisma.facility.update({
                where: {
                    id,
                },
                data: {
                    status: state,
                    ...(value !== undefined && {
                        value,
                    }),
                    updater: {
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
            io.emit("facilityControlled", result);
            return response_1.default.success(res, result, "Success control facility");
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                return response_1.default.error(res, error, error.response?.data?.message ??
                    "Failed to communicate with IoT server");
            }
            const err = error;
            return response_1.default.error(res, err, "Failed to control facility");
        }
    },
};
//# sourceMappingURL=iot.controller.js.map