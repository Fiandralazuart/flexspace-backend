"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBuildingSchema = exports.BuildingSchema = void 0;
const zod_1 = require("zod");
exports.BuildingSchema = zod_1.z.object({
    name: zod_1.z.string().min(3),
    location: zod_1.z.object({
        link: zod_1.z.string(),
        region: zod_1.z.number().int().positive(),
        address: zod_1.z.string().min(5),
    }),
    isPublished: zod_1.z.boolean().default(false),
});
exports.updateBuildingSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).optional(),
    location: zod_1.z
        .object({
        link: zod_1.z.string(),
        region: zod_1.z.number().int().positive(),
        address: zod_1.z.string().min(5),
    })
        .optional(),
    isPublished: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=building.validation.js.map