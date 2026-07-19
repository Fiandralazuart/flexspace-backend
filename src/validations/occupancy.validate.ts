import { z } from "zod";

export const createOccupancySchema = z.object({
	spaceId: z.string().min(1, "Space ID is required"),
	personCount: z
		.number()
		.int()
		.min(0, "Person count cannot be negative"),
});

export const updateOccupancySchema = createOccupancySchema.partial();

export type CreateOccupancyDTO = z.infer<typeof createOccupancySchema>;
export type UpdateOccupancyDTO = z.infer<typeof updateOccupancySchema>;