import { Response } from "express";
import { PrismaClient, Prisma } from "../../generated/prisma";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import {
	createScheduleSchema,
	CreateScheduleDTO,
	updateScheduleSchema,
	UpdateScheduleDTO,
} from "../validations/schedule.validation";

const prisma = new PrismaClient();

export default {
	async create(req: IReqUser, res: Response) {
		try {
			const io = req.app.get("io");
			const data: CreateScheduleDTO = createScheduleSchema.parse(req.body);

			const space = await prisma.space.findUnique({
				where: {
					id: data.spaceId,
				},
			});

			if (!space) {
				return response.notFound(res, "Space not found");
			}

			const overlap = await prisma.schedule.findFirst({
				where: {
					spaceId: data.spaceId,
					startTime: {
						lt: data.endTime,
					},
					endTime: {
						gt: data.startTime,
					},
				},
			});

			if (overlap) {
				return response.error(
					res,
					null,
					"Schedule overlaps with existing schedule",
				);
			}

			const result = await prisma.schedule.create({
				data: {
					title: data.title,
					description: data.description,
					startTime: data.startTime,
					endTime: data.endTime,
					type: data.type,
					status: data.status,
					space: {
						connect: {
							id: data.spaceId,
						},
					},
					creator: {
						connect: {
							id: req.user!.id,
						},
					},
				},
				include: {
					space: true,
				},
			});

			io.emit("scheduleCreated", result);

			response.success(res, result, "Success Create Schedule");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to create schedule");
		}
	},

	async findAll(req: IReqUser, res: Response) {
		try {
			const page = Number(req.query.page ?? 1);
			const limit = Number(req.query.limit ?? 10);
			const search = String(req.query.search ?? "");

			const skip = (page - 1) * limit;

			const where: Prisma.ScheduleWhereInput = {};

			if (search) {
				where.OR = [
					{
						title: {
							contains: search,
							mode: "insensitive",
						},
					},
				];
			}

			const [data, totalData] = await prisma.$transaction([
				prisma.schedule.findMany({
					where,
					skip,
					take: limit,
					orderBy: {
						startTime: "asc",
					},
					include: {
						space: true,
						creator: {
							select: {
								name: true,
								email: true,
							},
						},
					},
				}),
				prisma.schedule.count({
					where,
				}),
			]);

			response.success(
				res,
				{
					data,
					meta: {
						page,
						limit,
						totalData,
						totalPage: Math.ceil(totalData / limit),
					},
				},
				"Success Get All Schedule",
			);
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to find all schedule");
		}
	},

	async findOne(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;

			if (!id || Array.isArray(id))
				return response.notFound(res, "Schedule not found");

			const result = await prisma.schedule.findUnique({
				where: {
					id,
				},
				include: {
					space: true,
					creator: {
						select: {
							name: true,
							email: true,
						},
					},
					updater: {
						select: {
							name: true,
							email: true,
						},
					},
				},
			});

			if (!result) {
				return response.notFound(res, "Schedule not found");
			}

			response.success(res, result, "Success Get One Schedule");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to find one schedule");
		}
	},

	async update(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;
			const io = req.app.get("io");

			if (!id || Array.isArray(id))
				return response.notFound(res, "Schedule not found");

			const data: UpdateScheduleDTO = updateScheduleSchema.parse(req.body);

			const schedule = await prisma.schedule.findUnique({
				where: {
					id,
				},
			});

			if (!schedule) {
				return response.notFound(res, "Schedule not found");
			}

			const updateData: Prisma.ScheduleUpdateInput = {};

			if (data.spaceId !== undefined) {
				const space = await prisma.space.findUnique({
					where: {
						id: data.spaceId,
					},
				});

				if (!space) {
					return response.notFound(res, "Space not found");
				}

				updateData.space = {
					connect: {
						id: data.spaceId,
					},
				};
			}

			if (data.title !== undefined) updateData.title = data.title;

			if (data.description !== undefined)
				updateData.description = data.description;

			if (data.type !== undefined) updateData.type = data.type;

			if (data.status !== undefined) updateData.status = data.status;

			if (data.startTime !== undefined) updateData.startTime = data.startTime;

			if (data.endTime !== undefined) updateData.endTime = data.endTime;

			const spaceId = data.spaceId ?? schedule.spaceId;
			const startTime = data.startTime ?? schedule.startTime;
			const endTime = data.endTime ?? schedule.endTime;

			if (
				data.spaceId !== undefined ||
				data.startTime !== undefined ||
				data.endTime !== undefined
			) {
				const overlap = await prisma.schedule.findFirst({
					where: {
						id: {
							not: id,
						},
						spaceId,
						startTime: {
							lt: endTime,
						},
						endTime: {
							gt: startTime,
						},
					},
				});

				if (overlap) {
					return response.error(
						res,
						null,
						"Schedule overlaps with existing schedule",
					);
				}
			}

			updateData.updater = {
				connect: {
					id: req.user!.id,
				},
			};

			const result = await prisma.schedule.update({
				where: {
					id,
				},
				data: updateData,
				include: {
					space: true,
					creator: {
						select: {
							name: true,
							email: true,
						},
					},
					updater: {
						select: {
							name: true,
							email: true,
						},
					},
				},
			});

			io.emit("scheduleUpdated", result);

			response.success(res, result, "Success Update Schedule");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to update schedule");
		}
	},

	async delete(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;
			const io = req.app.get("io");

			if (!id || Array.isArray(id))
				return response.notFound(res, "Schedule not found");

			const schedule = await prisma.schedule.findUnique({
				where: { id },
			});

			if (!schedule) {
				return response.notFound(res, "Schedule not found");
			}

			const result = await prisma.schedule.delete({
				where: {
					id,
				},
			});

			io.emit("scheduleDeleted", {
				id: result.id,
			});

			response.success(res, result, "Success Delete Schedule");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to delete schedule");
		}
	},
};
