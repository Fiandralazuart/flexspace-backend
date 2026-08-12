import { Response } from "express";
import { Prisma, PrismaClient, BookingStatus } from "../../generated/prisma";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import {
	createBookingSchema,
	CreateBookingDTO,
	updateBookingSchema,
	UpdateBookingDTO,
} from "../validations/booking.validation";

const prisma = new PrismaClient();

export default {
	async create(req: IReqUser, res: Response) {
		try {
			const io = req.app.get("io");
			const data: CreateBookingDTO = createBookingSchema.parse(req.body);

			const result = await prisma.booking.create({
				data: {
					space: {
						connect: {
							id: data.spaceId,
						},
					},
					user: {
						connect: {
							id: req.user!.id,
						},
					},
					title: data.title,
					description: data.description,
					startTime: data.startTime,
					endTime: data.endTime,
					status: BookingStatus.PENDING,
				},
				include: {
					space: true,
					user: {
						select: {
							name: true,
							email: true,
						},
					},
				},
			});

			io.emit("bookingCreated", result);

			response.success(res, result, "Success Create Booking");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to create booking");
		}
	},

	async findAll(req: IReqUser, res: Response) {
		try {
			const page = Number(req.query.page ?? 1);
			const limit = Number(req.query.limit ?? 10);
			const search = String(req.query.search ?? "");

			const skip = (page - 1) * limit;

			const where: Prisma.BookingWhereInput = {};

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
				prisma.booking.findMany({
					where,
					skip,
					take: limit,
					orderBy: {
						createdAt: "desc",
					},
					include: {
						space: true,
						user: {
							select: {
								name: true,
								email: true,
							},
						},
					},
				}),
				prisma.booking.count({
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
				"Success Get All Booking",
			);
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to find all booking");
		}
	},
	async findMe(req: IReqUser, res: Response) {
		try {
			const page = Number(req.query.page ?? 1);
			const limit = Number(req.query.limit ?? 10);
			const search = String(req.query.search ?? "");

			const skip = (page - 1) * limit;

			const where: Prisma.BookingWhereInput = {
				userId: req.user!.id,
			};

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
				prisma.booking.findMany({
					where,
					skip,
					take: limit,
					orderBy: {
						createdAt: "desc",
					},
					include: {
						space: {
							include: {
								building: true,
							},
						},
						user: {
							select: {
								name: true,
								email: true,
							},
						},
					},
				}),
				prisma.booking.count({
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
				"Success Get My Booking",
			);
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to get my booking");
		}
	},

	async findOne(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;

			if (!id || Array.isArray(id))
				return response.notFound(res, "Booking not found");

			const result = await prisma.booking.findUnique({
				where: {
					id,
				},
				include: {
					space: true,
					user: {
						select: {
							name: true,
							email: true,
						},
					},
				},
			});

			if (!result) return response.notFound(res, "Booking not found");

			response.success(res, result, "Success Get One Booking");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to find booking");
		}
	},

	async update(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;
			const io = req.app.get("io");

			if (!id || Array.isArray(id))
				return response.notFound(res, "Booking not found");

			const data: UpdateBookingDTO = updateBookingSchema.parse(req.body);

			const updateData: Prisma.BookingUpdateInput = {};

			if (data.spaceId !== undefined) {
				updateData.space = {
					connect: {
						id: data.spaceId,
					},
				};
			}

			if (data.title !== undefined) {
				updateData.title = data.title;
			}

			if (data.description !== undefined) {
				updateData.description = data.description;
			}

			if (data.startTime !== undefined) {
				updateData.startTime = data.startTime;
			}

			if (data.endTime !== undefined) {
				updateData.endTime = data.endTime;
			}

			if (data.status !== undefined) {
				updateData.status = data.status;
			}

			const result = await prisma.booking.update({
				where: {
					id,
				},
				data: updateData,
				include: {
					space: true,
					user: {
						select: {
							name: true,
							email: true,
						},
					},
				},
			});

			io.emit("bookingUpdated", result);

			response.success(res, result, "Success Update Booking");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to update booking");
		}
	},

	async delete(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;
			const io = req.app.get("io");

			if (!id || Array.isArray(id))
				return response.notFound(res, "Booking not found");

			const result = await prisma.booking.delete({
				where: {
					id,
				},
			});

			io.emit("bookingDeleted", {
				id: result.id,
			});

			response.success(res, result, "Success Delete Booking");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to delete booking");
		}
	},
};
