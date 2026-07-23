"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlFacilitySchema = exports.updateDeviceSchema = exports.createDeviceSchema = exports.updateFacilitySchema = exports.createFacilitySchema = void 0;
const zod_1 = require("zod");
exports.createFacilitySchema = zod_1.z.object({
    deviceId: zod_1.z.string().cuid("Invalid device id"),
    name: zod_1.z
        .string()
        .min(1, "Facility name is required")
        .max(100, "Facility name is too long"),
    type: zod_1.z.enum(["LIGHT", "AIR_CONDITIONER"], {
        error: "Invalid facility type",
    }),
    channel: zod_1.z
        .number()
        .int("Channel must be an integer")
        .min(1, "Channel must be greater than 0"),
    status: zod_1.z.enum(["ON", "OFF"]).default("OFF"),
    value: zod_1.z.number().int().optional(),
});
exports.updateFacilitySchema = zod_1.z.object({
    deviceId: zod_1.z.string().cuid("Invalid device id").optional(),
    name: zod_1.z
        .string()
        .min(1, "Facility name is required")
        .max(100, "Facility name is too long")
        .optional(),
    type: zod_1.z.enum(["LIGHT", "AIR_CONDITIONER"]).optional(),
    channel: zod_1.z
        .number()
        .int("Channel must be an integer")
        .min(1, "Channel must be greater than 0")
        .optional(),
    status: zod_1.z.enum(["ON", "OFF"]).optional(),
    value: zod_1.z.number().int().optional(),
});
exports.createDeviceSchema = zod_1.z.object({
    spaceId: zod_1.z.string().cuid("Invalid space id"),
    name: zod_1.z
        .string()
        .min(1, "Device name is required")
        .max(100, "Device name is too long"),
    serialNumber: zod_1.z
        .string()
        .min(1, "Serial number is required")
        .max(100, "Serial number is too long"),
    status: zod_1.z.enum(["ONLINE", "OFFLINE"]).default("OFFLINE"),
});
exports.updateDeviceSchema = zod_1.z.object({
    spaceId: zod_1.z.string().cuid("Invalid space id").optional(),
    name: zod_1.z
        .string()
        .min(1, "Device name is required")
        .max(100, "Device name is too long")
        .optional(),
    serialNumber: zod_1.z
        .string()
        .min(1, "Serial number is required")
        .max(100, "Serial number is too long")
        .optional(),
    status: zod_1.z.enum(["ONLINE", "OFFLINE"]).optional(),
});
exports.controlFacilitySchema = zod_1.z.object({
    state: zod_1.z.enum(["ON", "OFF"]),
    value: zod_1.z.number().int().optional(),
});
//# sourceMappingURL=facility.validation.js.map