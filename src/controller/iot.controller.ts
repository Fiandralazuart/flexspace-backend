import axios from "axios";
import { Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";

const prisma = new PrismaClient();

const IOT_DEVICE_TYPE = {
	AIR_CONDITIONER: "AC",
	LIGHT: "LIGHT",
} as const;

export default {
	async control(req: IReqUser, res: Response) {
		try {
			const io = req.app.get("io");
			const { id } = req.params;

			const { status, value } = req.body;

			console.log(id, "fac");
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
			console.log("succes get facility");

			// Payload ke Backend IoT
			const payload = {
				type: IOT_DEVICE_TYPE[facility.type],
				channel: facility.channel, // nanti ganti menjadi facility.channel
				state: status,
				...(value !== undefined && { value }),
			};

			console.log("Failed");
			const iotResponse = await axios.post(
				`https://code.indodev.de/api/devices/${facility.device.serialNumber}`,
				payload,
			);

			if (!iotResponse.data.success) {
				return response.error(
					res,
					null,
					iotResponse.data.message ?? "Failed to control device",
				);
			}

			const result = await prisma.facility.update({
				where: {
					id,
				},
				data: {
					status: status,

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

			io.emit("facilityControlled", {
				id: result.id,
				status: result.status,
				value: result.value,
			});

			return response.success(res, result, "Success control facility");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.log("Status :", error.response?.status);
				console.log("Data   :", error.response?.data);
				console.log("URL    :", error.config?.url);
				console.log("Body   :", error.config?.data);

				return response.error(
					res,
					error,
					error.response?.data?.message ??
						"Failed to communicate with IoT server",
				);
			}

			console.log(error);

			return response.error(res, error as Error, "Failed to control facility");
		}
	},
	async getOnlineDevices(req: IReqUser, res: Response) {
		try {
			const { data } = await axios.get("https://code.indodev.de/api/devices");

			const onlineDevices = data.filter(
				(device: {
					id: number;
					name: string;
					ip: string;
					online: boolean;
					lastSeen: string | null;
				}) => device.online,
			);

			return response.success(res, onlineDevices, "Success get online devices");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return response.error(
					res,
					error,
					error.response?.data?.message ??
						"Failed to communicate with IoT server",
				);
			}

			return response.error(
				res,
				error as Error,
				"Failed to get online devices",
			);
		}
	},
};
