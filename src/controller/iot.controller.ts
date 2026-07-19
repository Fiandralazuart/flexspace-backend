import axios from "axios";
import { Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";

const prisma = new PrismaClient();

export default {
	async control(req: IReqUser, res: Response) {
		try {
			const io = req.app.get("io");
			const { id } = req.params;

			const { state, value } = req.body;

			if (!id || Array.isArray(id))
				return response.notFound(res, "Facility is not found");

			const facility = await prisma.facility.findUnique({
				where: {
					id,
				},
				include: {
					device: true,
				},
			});

			if (!facility) {
				return response.notFound(res, "Facility not found");
			}

			// Payload ke Backend IoT
			const payload = {
				type:
					facility.type === "AIR_CONDITIONER"
						? "AC"
						: "LIGHT",
				channel: facility.channel, // nanti ganti menjadi facility.channel
				state,
				...(value !== undefined && { value }),
			};

			const iotResponse = await axios.post(
				`${process.env.IOT_API_URL}/esp/${facility.device.serialNumber}`,
				payload
			);

			if (!iotResponse.data.success) {
				return response.error(
					res,
					null, 
					iotResponse.data.message ??
						"Failed to control device"
				);
			}

			const result = await prisma.facility.update({
				where: {
					id,
				},
				data: {
					status: state,

					...(value !== undefined && {
						value,
					}),

					updater: {
						connect: {
							id: req.user!.id,
						},
					},
				},
				include: {
					device: {
						select: {
							id: true,
							name: true,
							serialNumber: true,
							space: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
				},
			});

			io.emit("facilityControlled", result);

			return response.success(
				res,
				result,
				"Success control facility"
			);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return response.error(
					res,
					error,
					error.response?.data?.message ??
						"Failed to communicate with IoT server"
				);
			}

			const err = error as Error;

			return response.error(
				res,
				err,
				"Failed to control facility"
			);
		}
	},
};