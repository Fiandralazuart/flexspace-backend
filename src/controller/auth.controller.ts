import { Request, Response } from "express";
import { IReqUser } from "../utils/interface";
import { loginSchema, LoginDTO } from "../validations/auth.validation";
import { PrismaClient } from "../../generated/prisma";
import response from "../utils/response";
import { compare } from "../utils/encription";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/env";
import { verifyActivationToken } from "../utils/jwt";
import { USER_OMIT } from "../utils/constant";

const prisma = new PrismaClient();

type activaitonParams = {
	token: string;
};

export default {
	async login(req: IReqUser, res: Response) {
		try {
			const data: LoginDTO = loginSchema.parse(req.body);

			const user = await prisma.user.findUnique({
				where: {
					email: data.email,
				},
				include: {
					role: true,
				},
			});

			if (!user) {
				return response.notFound(res, "Email or password is incorrect");
			}

			const isMatch = compare(data.password, user.password);

			if (!isMatch) {
				return response.unauthorized(res, "Email or password is incorrect");
			}

			const token = jwt.sign(
				{
					id: user.id,
					roleId: user.roleId,
				},
				JWT_SECRET!,
				{
					expiresIn: "1d",
				},
			);

			response.success(
				res,
				{
					token,
					user: {
						...user,
					},
				},
				"Login success",
			);
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed Login");
		}
	},
	async activation(req: Request<activaitonParams>, res: Response) {
		try {
			const { token } = req.params;

			const data = verifyActivationToken(token);

			const result = await prisma.user.update({
				where: {
					id: data.id,
				},
				data: {
					emailVerified: true,
				},
			});

			return response.success(res, result, "Account activated successfully");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed Activated User");
		}
	},
	async aboutMe(req: IReqUser, res: Response) {
		try {
			const userId = req.user?.id;

			if (!userId) {
				return response.unauthorized(res, "Unauthorized");
			}

			const result = await prisma.user.findUnique({
				where: {
					id: userId,
				},
				include: {
					role: true,
					creator: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
					updater: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
				omit: USER_OMIT,
			});

			if (!result) {
				return response.notFound(res, "User not found");
			}

			response.success(res, result, "Success Get Profile");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed Get Profile");
		}
	},
};
