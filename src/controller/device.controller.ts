import { Response } from "express";
import { Prisma, PrismaClient } from "../../generated/prisma";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import { createDeviceSchema, updateDeviceSchema } from "../validations/facility.validation";


const prisma = new PrismaClient();

export default {
	async create(req: IReqUser, res: Response) {
		try {
			const io = req.app.get("io");
			const data = createDeviceSchema.parse(req.body);

			const result = await prisma.device.create({
				data: {
					name: data.name,
					serialNumber: data.serialNumber,
					status: "OFFLINE",

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
					space: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			});

			io.emit("deviceCreated", result);

			response.success(res, result, "Success create device");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to create device");
		}
	},

	async findAll(req: IReqUser, res: Response) {
		try {
			const result = await prisma.device.findMany({
				include: {
					space: {
						select: {
							id: true,
							name: true,
						},
					},
					facilities: true,
				},
			});

			if (result.length === 0)
				return response.notFound(res, "Database is empty");

			response.success(res, result, "Success find all data");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed");
		}
	},

	async findOne(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;

			if (!id || Array.isArray(id))
					return response.notFound(res, "User is not found");

			const result = await prisma.device.findUnique({
				where: {
					id,
				},
				include: {
					space: {
						select: {
							id: true,
							name: true,
						},
					},
					facilities: true,
				},
			});

			if (!result)
				return response.notFound(res, "Device not found");

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

			if (!id || Array.isArray(id))
        return response.notFound(res, "User is not found");

			const data = updateDeviceSchema.parse(req.body);

			const updateData: Prisma.DeviceUpdateInput = {};

			if (data.name !== undefined) {
				updateData.name = data.name;
			}

			if (data.serialNumber !== undefined) {
				updateData.serialNumber = data.serialNumber;
			}

			if (data.status !== undefined) {
				updateData.status = data.status;
			}

			if (data.spaceId !== undefined) {
				updateData.space = {
					connect: {
						id: data.spaceId,
					},
				};
			}

			updateData.updater = {
				connect: {
					id: req.user!.id,
				},
			};

			const result = await prisma.device.update({
				where: {
					id,
				},
				data: updateData,
				include: {
					space: {
						select: {
							id: true,
							name: true,
						},
					},
					facilities: true,
				},
			});

			io.emit("deviceUpdated", result);

			response.success(res, result, "Success update device");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to update device");
		}
	},

	async delete(req: IReqUser, res: Response) {
		try {
			const io = req.app.get("io");
			const { id } = req.params;

			if (!id || Array.isArray(id))
        return response.notFound(res, "User is not found");

			const result = await prisma.device.delete({
				where: {
					id,
				},
			});

			io.emit("deviceDeleted", {
				id: result.id,
			});

			response.success(res, result, "Success delete device");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to delete device");
		}
	},
};