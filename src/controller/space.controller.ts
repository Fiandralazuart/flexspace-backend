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

			response.success(res, result, "Success create space");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to create space");
		}
	},
	async findAll(req: IReqUser, res: Response) {
		try {
			const result = await prisma.space.findMany({
				include: {
					creator: {
						select: {
							name: true,
							email: true,
						},
					},
				},
			});

			if (result.length == 0)
				return response.notFound(res, "Database are empty");

			response.success(res, result, "Success find all data");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed");
		}
	},
	async findOne(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;

			if (!id || Array.isArray(id)) return response.notFound(res, "Invalid ID");

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

			response.success(res, result, "Success update space");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed");
		}
	},
	async delete(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;

			if (!id || Array.isArray(id)) return response.notFound(res, "Invalid ID");

			const result = await prisma.space.delete({
				where: {
					id,
				},
			});

			response.success(res, result, "Success delete space");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed");
		}
	},
};
