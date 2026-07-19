import { z } from "zod";

export const createFacilitySchema = z.object({
	deviceId: z.string().cuid("Invalid device id"),

	name: z
		.string()
		.min(1, "Facility name is required")
		.max(100, "Facility name is too long"),

	type: z.enum(["LIGHT", "AIR_CONDITIONER"], {
		error: "Invalid facility type",
	}),

	channel: z
		.number()
		.int("Channel must be an integer")
		.min(1, "Channel must be greater than 0"),

	status: z.enum(["ON", "OFF"]).default("OFF"),

	value: z.number().int().optional(),
});

export const updateFacilitySchema = z.object({
	deviceId: z.string().cuid("Invalid device id").optional(),

	name: z
		.string()
		.min(1, "Facility name is required")
		.max(100, "Facility name is too long")
		.optional(),

	type: z.enum(["LIGHT", "AIR_CONDITIONER"]).optional(),

	channel: z
		.number()
		.int("Channel must be an integer")
		.min(1, "Channel must be greater than 0")
		.optional(),

	status: z.enum(["ON", "OFF"]).optional(),

	value: z.number().int().optional(),
});


export const createDeviceSchema = z.object({
	spaceId: z.string().cuid("Invalid space id"),

	name: z
		.string()
		.min(1, "Device name is required")
		.max(100, "Device name is too long"),

	serialNumber: z
		.string()
		.min(1, "Serial number is required")
		.max(100, "Serial number is too long"),

	status: z.enum(["ONLINE", "OFFLINE"]).default("OFFLINE"),
});

export const updateDeviceSchema = z.object({
	spaceId: z.string().cuid("Invalid space id").optional(),

	name: z
		.string()
		.min(1, "Device name is required")
		.max(100, "Device name is too long")
		.optional(),

	serialNumber: z
		.string()
		.min(1, "Serial number is required")
		.max(100, "Serial number is too long")
		.optional(),

	status: z.enum(["ONLINE", "OFFLINE"]).optional(),
});

export const controlFacilitySchema = z.object({
	state: z.enum(["ON", "OFF"]),

	value: z.number().int().optional(),
});


export type ControlFacilityDTO = z.infer<typeof controlFacilitySchema>;


export type CreateFacilityDTO = z.infer<typeof createFacilitySchema>;
export type UpdateFacilityDTO = z.infer<typeof updateFacilitySchema>;

export type CreateDeviceDTO = z.infer<typeof createDeviceSchema>;
export type UpdateDeviceDTO = z.infer<typeof updateDeviceSchema>;