
import { z } from "zod";
import { BookingStatus } from "../../generated/prisma";

export const createBookingSchema = z
	.object({
		spaceId: z.string().cuid(),

		title: z
			.string()
			.min(3, "Title must be at least 3 characters")
			.max(100, "Title cannot exceed 100 characters"),

		description: z
			.string()
			.max(500, "Description cannot exceed 500 characters")
			.optional(),

		startTime: z.coerce.date(),

		endTime: z.coerce.date(),
	})
	.refine((data) => data.endTime > data.startTime, {
		message: "End time must be after start time",
		path: ["endTime"],
	});

export const updateBookingSchema = z
	.object({
		spaceId: z.string().cuid().optional(),

		title: z
			.string()
			.min(3, "Title must be at least 3 characters")
			.max(100, "Title cannot exceed 100 characters")
			.optional(),

		description: z
			.string()
			.max(500, "Description cannot exceed 500 characters")
			.optional(),

		startTime: z.coerce.date().optional(),

		endTime: z.coerce.date().optional(),

		status: z.nativeEnum(BookingStatus).optional(),
	})
	.refine(
		(data) =>
			!data.startTime ||
			!data.endTime ||
			data.endTime > data.startTime,
		{
			message: "End time must be after start time",
			path: ["endTime"],
		},
	);

export type CreateBookingDTO = z.infer<typeof createBookingSchema>;
export type UpdateBookingDTO = z.infer<typeof updateBookingSchema>;