import { Response } from "express";
import { IReqUser } from "../utils/interface";
import {
	createGeneralUserDTO,
	createGeneralUserSchema,
	createUserDTO,
	createUserSchema,
	updateUserDTO,
	updateUserSchema,
} from "../validations/user.validation";
import { PrismaClient, Prisma } from "../../generated/prisma";
import response from "../utils/response";
import { encrypt } from "../utils/encription";
import { sendActivationEmail } from "../services/mail.service";
import cuid from "cuid";
import { USER_OMIT } from "../utils/constant";

const prisma = new PrismaClient();

export default {
	async createUser(req: IReqUser, res: Response) {
		try {
			const io = req.app.get("io")

			const data: createUserDTO = createUserSchema.parse(req.body);

			const result = await prisma.user.create({
				data: {
					name: data.name,
					email: data.email,
					roleId: data.roleId,
					phone: data.phone ?? null,
					password: await encrypt(data.password),
					createdBy: req.user!.id,
				},
				omit: USER_OMIT
			});

			await sendActivationEmail(result);

			io.emit("userCreated", result)

			response.success(res, result, "Success Create User");
		} catch (error) {
			const err = error as unknown as Error;
			response.error(res, err, "Failed Create User");
		}
	},
	async findUser(req: IReqUser, res: Response) {
		try {
			const result = await prisma.user.findMany({
				include: {
					creator: {
						select: {
							name: true,
							email: true,
						},
					},
				},
				omit: USER_OMIT
			});

			if (result.length == 0) {
				return response.notFound(res, "No Data Found");
			}

			response.success(res, result, "Success Get All Data");
		} catch (error) {
			const err = error as unknown as Error;
			response.error(res, err, "Failed to findUser");
		}
	},
	async findUserById(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;

			if (!id || Array.isArray(id))
				return response.notFound(res, "User is not found");

			const result = await prisma.user.findUnique({
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
				omit: USER_OMIT
			});

			if (!result) return response.notFound(res, "Data Not Found");

			response.success(res, result, "Success Get one Data");
		} catch (error) {
			const err = error as unknown as Error;
			response.error(res, err, "Failed to findUserById");
		}
	},
	async updateUser(req: IReqUser, res: Response) {
		try {
			const io = req.app.get("io")
			const { id } = req.params;
			const { name, phone, roleId } = req.body;

			const data: updateUserDTO = updateUserSchema.parse({
				name,
				phone,
				roleId,
			});

			if (!id || Array.isArray(id))
				return response.notFound(res, "User is not found");

			const updateData: Prisma.UserUpdateInput = {};

			if (data.name !== undefined) {
				updateData.name = data.name;
			}

			if (data.phone !== undefined) {
				updateData.phone = data.phone;
			}

			if (data.roleId !== undefined) {
				updateData.role = {
					connect: {
						id: data.roleId,
					},
				};
			}

			updateData.updater = {
				connect: {
					id: req.user!.id,
				},
			};

			const result = await prisma.user.update({
				where: { id },
				data: updateData,
				omit: USER_OMIT
			});

			io.emit("userUpdated", {
				id: result.id,
				name: result.name,
				phone: result.phone,
				roleId: result.roleId
			})

			response.success(res, result, "Success Update User");
		} catch (error) {
			const err = error as unknown as Error;
			response.error(res, err, "Failed to Update User");
		}
	},
	async delete(req: IReqUser, res: Response) {
		try {
			const { id } = req.params;
			const io = req.app.get("io")

			if (!id || Array.isArray(id))
				return response.notFound(res, "User is not found");

			const result = await prisma.user.delete({
				where: {
					id,
				},
				omit: USER_OMIT
			});

			io.emit("userDeleted", {
				id: result.id
			})
			response.success(res, result, "Success Delete User");
		} catch (error) {
			const err = error as unknown as Error;
			response.error(res, err, "Failed to Delete User");
		}
	},
	async createGeneralUser(req: IReqUser, res: Response) {
		try {
			const io = req.app.get("io")
			const data: createGeneralUserDTO = createGeneralUserSchema.parse(req.body);

			const id = cuid();
			const result = await prisma.user.create({
				data: {
					id,
					name: data.name,
					email: data.email,
					roleId: 4,
					phone: data.phone ?? null,
					password: await encrypt(data.password),
					createdBy: id,
				},
				omit: USER_OMIT
			});

			await sendActivationEmail(result);

			io.emit("generalUserCreated", result)

			response.success(res, result, "Success Create General User");
		} catch (error) {
			const err = error as unknown as Error;
			response.error(res, err, "Failed Create User");
		}
	},
};
