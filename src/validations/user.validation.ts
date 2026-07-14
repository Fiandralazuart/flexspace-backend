import { z } from "zod"

export const createUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Nama minimal 3 karakter")
      .max(100, "Nama maksimal 100 karakter"),

    email: z.email("Format email tidak valid"),

    phone: z
      .string()
      .min(10, "Nomor HP minimal 10 digit")
      .max(15, "Nomor HP maksimal 15 digit")
      .optional(),

    roleId: z
      .number()
      .int()
      .positive("Role tidak valid"),

    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .max(72, "Password maksimal 72 karakter")
      .regex(/[A-Z]/, "Harus memiliki huruf besar")
      .regex(/[a-z]/, "Harus memiliki huruf kecil")
      .regex(/[0-9]/, "Harus memiliki angka"),

    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password tidak sama"
  });

	export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  phone: z.string().min(10).max(15).optional(),
  roleId: z.number().int().optional(),
});

export type createUserDTO = z.infer<typeof createUserSchema>
export type updateUserDTO = z.infer<typeof updateUserSchema>