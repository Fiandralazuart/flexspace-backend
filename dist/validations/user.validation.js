"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createGeneralUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .trim()
        .min(3, "Nama minimal 3 karakter")
        .max(100, "Nama maksimal 100 karakter"),
    email: zod_1.z.email("Format email tidak valid"),
    phone: zod_1.z
        .string()
        .min(10, "Nomor HP minimal 10 digit")
        .max(15, "Nomor HP maksimal 15 digit")
        .optional(),
    roleId: zod_1.z
        .number()
        .int()
        .positive("Role tidak valid"),
    password: zod_1.z
        .string()
        .min(8, "Password minimal 8 karakter")
        .max(72, "Password maksimal 72 karakter")
        .regex(/[A-Z]/, "Harus memiliki huruf besar")
        .regex(/[a-z]/, "Harus memiliki huruf kecil")
        .regex(/[0-9]/, "Harus memiliki angka"),
    confirmPassword: zod_1.z.string()
})
    .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password tidak sama"
});
exports.createGeneralUserSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .trim()
        .min(3, "Nama minimal 3 karakter")
        .max(100, "Nama maksimal 100 karakter"),
    email: zod_1.z.email("Format email tidak valid"),
    phone: zod_1.z
        .string()
        .min(10, "Nomor HP minimal 10 digit")
        .max(15, "Nomor HP maksimal 15 digit")
        .optional(),
    password: zod_1.z
        .string()
        .min(8, "Password minimal 8 karakter")
        .max(72, "Password maksimal 72 karakter")
        .regex(/[A-Z]/, "Harus memiliki huruf besar")
        .regex(/[a-z]/, "Harus memiliki huruf kecil")
        .regex(/[0-9]/, "Harus memiliki angka"),
    confirmPassword: zod_1.z.string()
})
    .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password tidak sama"
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).optional(),
    phone: zod_1.z.string().min(10).max(15).optional(),
    roleId: zod_1.z.number().int().optional(),
});
//# sourceMappingURL=user.validation.js.map