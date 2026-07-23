"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../../generated/prisma");
const response_1 = __importDefault(require("../../utils/response"));
const prisma = new prisma_1.PrismaClient();
exports.default = {
    async trend(req, res) {
        try {
            const result = await prisma.$queryRaw `
				SELECT
					DATE(o."detectedAt") AS "date",
					ROUND(AVG(o."personCount"))::int AS "averagePeople"
				FROM "occupancy_logs" o
				GROUP BY DATE(o."detectedAt")
				ORDER BY DATE(o."detectedAt");
			`;
            response_1.default.success(res, result, "Success get occupancy trend");
        }
        catch (error) {
            response_1.default.error(res, error, "Failed To Get Data Analitic");
        }
    },
    async peakHour(req, res) {
        try {
            const result = await prisma.$queryRaw `
				SELECT
					EXTRACT(HOUR FROM o."detectedAt")::int AS hour,
					ROUND(AVG(o."personCount"))::int AS "averagePeople"
				FROM "occupancy_logs" o
				GROUP BY hour
				ORDER BY hour;
			`;
            response_1.default.success(res, result, "Success get peak hour");
        }
        catch (error) {
            response_1.default.error(res, error, "Failed To Get Data Analitic");
        }
    },
    async status(req, res) {
        try {
            const result = await prisma.$queryRaw `
				SELECT
					"occupancyStatus",
					COUNT(*)::int AS total
				FROM "spaces"
				GROUP BY "occupancyStatus";
			`;
            response_1.default.success(res, result, "Success get occupancy status");
        }
        catch (error) {
            response_1.default.error(res, error, "Failed To Get Data Analitic");
        }
    },
    async utilization(req, res) {
        try {
            const result = await prisma.$queryRaw `
				SELECT
					s.id AS "spaceId",
					s.name AS "spaceName",
					s.capacity,
					ROUND(AVG(o."personCount"))::int AS "averagePeople",
					ROUND((AVG(o."personCount") / s.capacity * 100))::int AS utilization
				FROM "occupancy_logs" o
				JOIN "spaces" s
					ON s.id = o."spaceId"
				GROUP BY s.id, s.name, s.capacity
				ORDER BY utilization DESC;
			`;
            response_1.default.success(res, result, "Success get utilization");
        }
        catch (error) {
            response_1.default.error(res, error, "Failed To Get Data Analitic");
        }
    },
    async topSpaces(req, res) {
        try {
            const result = await prisma.$queryRaw `
				SELECT
					s.id AS "spaceId",
					s.name AS "spaceName",
					ROUND(AVG(o."personCount"))::int AS "averagePeople"
				FROM "occupancy_logs" o
				JOIN "spaces" s
					ON s.id = o."spaceId"
				GROUP BY s.id, s.name
				ORDER BY AVG(o."personCount") DESC
				LIMIT 5;
			`;
            response_1.default.success(res, result, "Success get top spaces");
        }
        catch (error) {
            response_1.default.error(res, error, "Failed To Get Data Analitic");
        }
    },
    async summary(req, res) {
        try {
            const [averagePeople, peakHour, spacesMonitored] = await Promise.all([
                prisma.$queryRaw `
					SELECT
						ROUND(AVG("personCount"))::int AS "averagePeople"
					FROM "occupancy_logs";
				`,
                prisma.$queryRaw `
					SELECT
						EXTRACT(HOUR FROM "detectedAt")::int AS hour
					FROM "occupancy_logs"
					GROUP BY hour
					ORDER BY AVG("personCount") DESC
					LIMIT 1;
				`,
                prisma.space.count(),
            ]);
            response_1.default.success(res, {
                averagePeople: averagePeople[0]?.averagePeople ?? 0,
                peakHour: peakHour[0]?.hour ?? null,
                spacesMonitored,
            }, "Success get occupancy summary");
        }
        catch (error) {
            response_1.default.error(res, error, "Failed To Get Data Analitic");
        }
    },
};
//# sourceMappingURL=occupancyAnalitic.controller.js.map