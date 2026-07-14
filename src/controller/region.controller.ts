import { Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";

const prisma = new PrismaClient();

export default {
	async getProvinces(req: IReqUser, res: Response) {
		try {
			const result = await prisma.province.findMany({
				orderBy: {
					name: "asc",
				},
			});

			if (result.length === 0)
				return response.notFound(res, "No Province Found");

			response.success(res, result, "Success Get Provinces");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to get provinces");
		}
	},

	async getRegencies(req: IReqUser, res: Response) {
		try {
			const { provinceId } = req.params;

			if (!provinceId || Array.isArray(provinceId))
				return response.notFound(res, "User is not found");

			const result = await prisma.regency.findMany({
				where: {
					provinceId,
				},
				orderBy: {
					name: "asc",
				},
			});

			if (result.length === 0)
				return response.notFound(res, "No Regency Found");

			response.success(res, result, "Success Get Regencies");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to get regencies");
		}
	},

	async getDistricts(req: IReqUser, res: Response) {
		try {
			const { regencyId } = req.params;

			if (!regencyId || Array.isArray(regencyId))
				return response.notFound(res, "User is not found");

			const result = await prisma.district.findMany({
				where: {
					regencyId,
				},
				orderBy: {
					name: "asc",
				},
			});

			if (result.length === 0)
				return response.notFound(res, "No District Found");

			response.success(res, result, "Success Get Districts");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to get districts");
		}
	},

	async getVillages(req: IReqUser, res: Response) {
		try {
			const { districtId } = req.params;

			if (!districtId || Array.isArray(districtId))
				return response.notFound(res, "District is not found");

			const result = await prisma.village.findMany({
				where: {
					districtId,
				},
				orderBy: {
					name: "asc",
				},
			});

			if (result.length === 0)
				return response.notFound(res, "No Village Found");

			response.success(res, result, "Success Get Villages");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to get villages");
		}
	},

	async findByCity(req: IReqUser, res: Response) {
		try {
			const { name } = req.query;

			if (!name || typeof name !== "string") {
				return response.notFound(res, "City name is required");
			}

			const result = await prisma.regency.findMany({
				where: {
					name: {
						contains: name,
						mode: "insensitive",
					},
				},
				include: {
					province: {
						select: {
							id: true,
							name: true,
						},
					},
				},
				orderBy: {
					name: "asc",
				},
			});

			if (result.length === 0) {
				return response.notFound(res, "No City Found");
			}

			response.success(res, result, "Success Get Region By City");
		} catch (error) {
			const err = error as Error;
			response.error(res, err, "Failed to get region by city");
		}
	},
};
