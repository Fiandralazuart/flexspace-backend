import { z } from "zod";

export const BuildingSchema = z.object({
    name: z.string().min(3),

    location: z.object({
        link: z.string(),
        region: z.number().int().positive(),
        address: z.string().min(5)
    }),
});


export const updateBuildingSchema = BuildingSchema.partial();

export type CreateBuildingDTO = z.infer<typeof BuildingSchema>;
export type UpdateBuildingDTO = z.infer<typeof updateBuildingSchema>;