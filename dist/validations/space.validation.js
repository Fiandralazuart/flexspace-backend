"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSpaceSchema = exports.createSpaceSchema = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../generated/prisma");
exports.createSpaceSchema = zod_1.z.object({
    buildingId: zod_1.z.string().cuid(),
    name: zod_1.z.string().trim().min(3, "Name must be at least 3 characters").max(100),
    description: zod_1.z.string().trim(),
    floor: zod_1.z.number().int().min(0).optional(),
    capacity: zod_1.z.number().int().positive(),
    picture: zod_1.z.string(),
    pictureId: zod_1.z.string(),
    status: zod_1.z.nativeEnum(prisma_1.SpaceStatus).optional(),
});
exports.updateSpaceSchema = zod_1.z.object({
    buildingId: zod_1.z.string().cuid().optional(),
    name: zod_1.z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name must not exceed 100 characters")
        .optional(),
    description: zod_1.z.string().trim().optional(),
    floor: zod_1.z.number().int().min(0).optional(),
    capacity: zod_1.z
        .number()
        .int()
        .positive("Capacity must be greater than 0")
        .optional(),
    picture: zod_1.z.string().url().optional(),
    pictureId: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(prisma_1.SpaceStatus).optional(),
    isPublished: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=space.validation.js.map