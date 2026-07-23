import { Response } from "express";
import { IReqUser } from "../../utils/interface";
import { PrismaClient } from "../../../generated/prisma";
import response from "../../utils/response";

const prisma = new PrismaClient();

export default {
	async trend(req: IReqUser, res: Response) {
		try {
			const result = await prisma.$queryRaw<
				{
					date: Date;
					averagePeople: number;
				}[]
			>`
				SELECT
					DATE(o."detectedAt") AS "date",
					ROUND(AVG(o."personCount"))::int AS "averagePeople"
				FROM "occupancy_logs" o
				GROUP BY DATE(o."detectedAt")
				ORDER BY DATE(o."detectedAt");
			`;

			response.success(
				res,
				result,
				"Success get occupancy trend",
			);
		} catch (error) {
			response.error(res, error as Error, "Failed To Get Data Analitic");
		}
	},

	async peakHour(req: IReqUser, res: Response) {
		try {
			const result = await prisma.$queryRaw<
				{
					hour: number;
					averagePeople: number;
				}[]
			>`
				SELECT
					EXTRACT(HOUR FROM o."detectedAt")::int AS hour,
					ROUND(AVG(o."personCount"))::int AS "averagePeople"
				FROM "occupancy_logs" o
				GROUP BY hour
				ORDER BY hour;
			`;

			response.success(
				res,
				result,
				"Success get peak hour",
			);
		} catch (error) {
			response.error(res, error as Error, "Failed To Get Data Analitic");
		}
	},

	async status(req: IReqUser, res: Response) {
		try {
			const result = await prisma.$queryRaw<
				{
					occupancyStatus: string;
					total: number;
				}[]
			>`
				SELECT
					"occupancyStatus",
					COUNT(*)::int AS total
				FROM "spaces"
				GROUP BY "occupancyStatus";
			`;

			response.success(
				res,
				result,
				"Success get occupancy status",
			);
		} catch (error) {
			response.error(res, error as Error, "Failed To Get Data Analitic");
		}
	},

	async utilization(req: IReqUser, res: Response) {
		try {
			const result = await prisma.$queryRaw<
				{
					spaceId: string;
					spaceName: string;
					capacity: number;
					averagePeople: number;
					utilization: number;
				}[]
			>`
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

			response.success(
				res,
				result,
				"Success get utilization",
			);
		} catch (error) {
			response.error(res, error as Error, "Failed To Get Data Analitic");
		}
	},

	async topSpaces(req: IReqUser, res: Response) {
		try {
			const result = await prisma.$queryRaw<
				{
					spaceId: string;
					spaceName: string;
					averagePeople: number;
				}[]
			>`
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

			response.success(
				res,
				result,
				"Success get top spaces",
			);
		} catch (error) {
			response.error(res, error as Error, "Failed To Get Data Analitic");
		}
	},

	async summary(req: IReqUser, res: Response) {
		try {
			const [averagePeople, peakHour, spacesMonitored] = await Promise.all([
				prisma.$queryRaw<
					{
						averagePeople: number;
					}[]
				>`
					SELECT
						ROUND(AVG("personCount"))::int AS "averagePeople"
					FROM "occupancy_logs";
				`,
				prisma.$queryRaw<
					{
						hour: number;
					}[]
				>`
					SELECT
						EXTRACT(HOUR FROM "detectedAt")::int AS hour
					FROM "occupancy_logs"
					GROUP BY hour
					ORDER BY AVG("personCount") DESC
					LIMIT 1;
				`,
				prisma.space.count(),
			]);

			response.success(
				res,
				{
					averagePeople: averagePeople[0]?.averagePeople ?? 0,
					peakHour: peakHour[0]?.hour ?? null,
					spacesMonitored,
				},
				"Success get occupancy summary",
			);
		} catch (error) {
			response.error(res, error as Error, "Failed To Get Data Analitic");
		}
	},
};