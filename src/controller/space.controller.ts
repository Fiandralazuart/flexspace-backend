import { Response } from "express";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import {
	createSpaceSchema,
	updateSpaceSchema,
} from "../validations/space.validation";
import { Prisma, PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export default {
	async create(req: IReqUser, res: Response) {
		try {
			const io = req.app.get("io");
			const data = createSpaceSchema.parse(req.body);

			const result = await prisma.space.create({
				data: {
					name: data.name,
					description: data.description,
					capacity: data.capacity,
					picture: data.picture,
					pictureId: data.pictureId,
					...(data.floor !== undefined && {
						floor: data.floor,
					}),
					...(data.status !== undefined && {
						status: data.status,
					}),
					building: {
						connect: {
							id: data.buildingId,
						},
					},
					creator: {
						connect: {
							id: req.user!.id,
						},
					},
				},
			});

			io.emit("spaceCreated", result);
			response.success(res, result, "Success create space");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to create space");
		}
	},
	async findAll(req: IReqUser, res: Response) {
		try {
			const page = Number(req.query.page ?? 1);
			const limit = Number(req.query.limit ?? 10);
			const search = String(req.query.search ?? "");

			const skip = (page - 1) * limit;

			const where: Prisma.SpaceWhereInput = {};

			if (search) {
				where.OR = [
					{
						name: {
							contains: search,
							mode: "insensitive",
						},
					},
					{
						building: {
							name: {
								contains: search,
								mode: "insensitive",
							},
						},
					},
				];
			}
			const [data, totalData] = await Promise.all([
				prisma.space.findMany({
					where,
					skip,
					take: limit,
					orderBy: {
						createdAt: "desc",
					},
					include: {
						creator: {
							select: {
								name: true,
								email: true,
							},
						},
						building: {
							select: {
								id: true,
								name: true,
							},
						},
						devices: {
							select: {
								id: true,
								name: true,
								status: true,
								serialNumber: true,
							},
						},
					},
				}),

				prisma.space.count({
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
				"Success find all data",
			);
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed");
		}
	},
	async findOne(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;

			if (!id || Array.isArray(id)) return response.notFound(res, "Invalid ID");
			console.log("ID:", id);

			const result = await prisma.space.findUnique({
				where: {
					id,
				},
				include: {
					creator: {
						select: {
							name: true,
							email: true,
						},
					},
					building: {
						select: {
							id: true,
							name: true,
						},
					},
					devices: {
						select: {
							id: true,
							name: true,
							status: true,
							serialNumber: true,
						},
					},
				},
			});

			response.success(res, result, "Success find one data");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed");
		}
	},
	async update(req: IReqUser, res: Response) {
		try {
			const io = req.app.get("io");
			const { id } = req.params;
			const data = updateSpaceSchema.parse(req.body);

			if (!id || Array.isArray(id)) return response.notFound(res, "Invalid ID");

			const updateData: Prisma.SpaceUpdateInput = {};

			if (data.name !== undefined) {
				updateData.name = data.name;
			}

			if (data.description !== undefined) {
				updateData.description = data.description;
			}

			if (data.capacity !== undefined) {
				updateData.capacity = data.capacity;
			}

			if (data.picture !== undefined) {
				updateData.picture = data.picture;
			}

			if (data.pictureId !== undefined) {
				updateData.pictureId = data.pictureId;
			}

			if (data.floor !== undefined) {
				updateData.floor = data.floor;
			}

			if (data.status !== undefined) {
				updateData.status = data.status;
			}

			if (data.isPublished !== undefined) {
				updateData.isPublished = data.isPublished;
			}

			if (data.buildingId !== undefined) {
				updateData.building = {
					connect: {
						id: data.buildingId,
					},
				};
			}

			updateData.updater = {
				connect: {
					id: req.user!.id,
				},
			};

			const result = await prisma.space.update({
				where: {
					id,
				},
				data: updateData,
			});

			io.emit("spaceUpdated", result);
			response.success(res, result, "Success update space");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed");
		}
	},
	async delete(req: IReqUser, res: Response) {
		try {
			const io = req.app.get("io");
			const { id } = req.params;

			if (!id || Array.isArray(id)) return response.notFound(res, "Invalid ID");

			const result = await prisma.space.delete({
				where: {
					id,
				},
			});

			io.emit("spaceDeleted", {
				id: result.id,
			});
			response.success(res, result, "Success delete space");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed");
		}
	},
};
