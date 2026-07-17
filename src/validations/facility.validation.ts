import { z } from "zod";

export const createFacilitySchema = z.object({
	spaceId: z.string().cuid("Invalid space id"),
	name: z
		.string()
		.min(1, "Facility name is required")
		.max(100, "Facility name is too long"),
	status: z
		.string()
		.min(1, "Facility status is required")
		.max(50, "Facility status is too long"),
});

export const updateFacilitySchema = z.object({
	spaceId: z.string().cuid("Invalid space id").optional(),
	name: z
		.string()
		.min(1, "Facility name is required")
		.max(100, "Facility name is too long")
		.optional(),
	status: z
		.string()
		.min(1, "Facility status is required")
		.max(50, "Facility status is too long")
		.optional(),
});

export type CreateFacilityDTO = z.infer<typeof createFacilitySchema>;
export type UpdateFacilityDTO = z.infer<typeof updateFacilitySchema>;