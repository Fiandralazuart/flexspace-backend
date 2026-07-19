import { Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import response from "../utils/response";
import { IReqUser } from "../utils/interface";
import { createOccupancySchema } from "../validations/occupancy.validate";

const prisma = new PrismaClient();

export default {
	async create(req: IReqUser, res: Response) {
		try {
			const io = req.app.get("io");
			const data = createOccupancySchema.parse(req.body);

			const occupancyStatus =
				data.personCount > 0 ? "OCCUPIED" : "EMPTY";

			await prisma.space.update({
				where: {
					id: data.spaceId,
				},
				data: {
					personCount: data.personCount,
					occupancyStatus,
					lastDetectedAt: new Date(),
				},
			});

			const result = await prisma.occupancyLog.create({
				data: {
					space: {
						connect: {
							id: data.spaceId,
						},
					},
					personCount: data.personCount,
					occupancyStatus,
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

			io.emit("occupancyUpdated", result);

			response.success(
				res,
				result,
				"Success update occupancy"
			);
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to update occupancy");
		}
	},

	async findAll(req: IReqUser, res: Response) {
		try {
			const result = await prisma.occupancyLog.findMany({
				include: {
					space: {
						select: {
							id: true,
							name: true,
						},
					},
				},
				orderBy: {
					detectedAt: "desc",
				},
			});

			if (result.length == 0)
				return response.notFound(res, "Database are empty");

			response.success(
				res,
				result,
				"Success find all occupancy"
			);
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed");
		}
	},

	async findBySpace(req: IReqUser, res: Response) {
		try {
			const { spaceId } = req.params;

			if (!spaceId || Array.isArray(spaceId))
				return response.notFound(res, "Invalid Space ID");

			const result = await prisma.occupancyLog.findMany({
				where: {
					spaceId,
				},
				orderBy: {
					detectedAt: "desc",
				},
			});

			response.success(
				res,
				result,
				"Success find occupancy"
			);
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed");
		}
	},
};