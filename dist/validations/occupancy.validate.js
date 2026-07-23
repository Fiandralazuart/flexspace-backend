"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOccupancySchema = exports.createOccupancySchema = void 0;
const zod_1 = require("zod");
exports.createOccupancySchema = zod_1.z.object({
    spaceId: zod_1.z.string().min(1, "Space ID is required"),
    personCount: zod_1.z
        .number()
        .int()
        .min(0, "Person count cannot be negative"),
});
exports.updateOccupancySchema = exports.createOccupancySchema.partial();
//# sourceMappingURL=occupancy.validate.js.map