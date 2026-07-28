import { z } from "zod";

export const createScheduleSchema = z
	.object({
		spaceId: z.string().cuid("Invalid space id"),

		type: z.enum([
			"EVENT",
			"MAINTENANCE",
			"HOLIDAY",
			"BLOCKED",
		]),

		status: z.enum([
			"ACTIVE",
			"CANCELLED",
		]),

		title: z
			.string()
			.trim()
			.min(1, "Title is required")
			.max(100, "Title cannot exceed 100 characters"),

		description: z
			.string()
			.trim()
			.max(500, "Description cannot exceed 500 characters")
			.optional(),

		startTime: z.coerce.date(),

		endTime: z.coerce.date(),
	})
	.refine((data) => data.endTime > data.startTime, {
		message: "End time must be after start time",
		path: ["endTime"],
	});

export const updateScheduleSchema = z
	.object({
		type: z
			.enum([
				"EVENT",
				"MAINTENANCE",
				"HOLIDAY",
				"BLOCKED",
			])
			.optional(),

		status: z
			.enum([
				"ACTIVE",
				"CANCELLED",
			])
			.optional(),

		title: z
			.string()
			.trim()
			.min(1, "Title is required")
			.max(100, "Title cannot exceed 100 characters")
			.optional(),

		description: z
			.string()
			.trim()
			.max(500, "Description cannot exceed 500 characters")
			.optional(),

		startTime: z.coerce.date().optional(),

		endTime: z.coerce.date().optional(),
		spaceId: z.string().cuid("Invalid space id").optional(),
	})
	.refine(
		(data) => {
			if (!data.startTime || !data.endTime) return true;

			return data.endTime > data.startTime;
		},
		{
			message: "End time must be after start time",
			path: ["endTime"],
		},
	);

export type UpdateScheduleDTO = z.infer<
	typeof updateScheduleSchema
>;

export type CreateScheduleDTO = z.infer<
	typeof createScheduleSchema
>;