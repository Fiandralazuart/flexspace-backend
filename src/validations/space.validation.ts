import { z } from "zod";
import { SpaceStatus } from "../../generated/prisma";

export const createSpaceSchema = z.object({
	buildingId: z.string().cuid(),

	name: z.string().trim().min(3, "Name must be at least 3 characters").max(100),

	description: z.string().trim(),

	floor: z.number().int().min(0).optional(),

	capacity: z.number().int().positive(),

	picture: z.string(),

	pictureId: z.string(),

	status: z.nativeEnum(SpaceStatus).optional(),
});

export const updateSpaceSchema = z.object({
	buildingId: z.string().cuid().optional(),

	name: z
		.string()
		.trim()
		.min(3, "Name must be at least 3 characters")
		.max(100, "Name must not exceed 100 characters")
		.optional(),

	description: z.string().trim().optional(),

	floor: z.number().int().min(0).optional(),

	capacity: z
		.number()
		.int()
		.positive("Capacity must be greater than 0")
		.optional(),

	picture: z.string().url().optional(),

	pictureId: z.string().optional(),

	status: z.nativeEnum(SpaceStatus).optional(),
	isPublished: z.boolean().optional(),
});

export type CreateSpaceDTO = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceDTO = z.infer<typeof updateSpaceSchema>;
