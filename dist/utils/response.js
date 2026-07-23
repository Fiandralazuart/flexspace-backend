"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const prisma_1 = require("../../generated/prisma");
// type Pagination = {
// 	totalPages: number;
// 	current: number;
// 	total: number;
// };
exports.default = {
    success(res, data, message) {
        return res.status(200).json({
            meta: {
                status: 200,
                message,
            },
            data,
        });
    },
    error(res, error, message) {
        // Validation Error (Zod)
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                meta: {
                    status: 400,
                    message: "Validation Error",
                },
                data: error.flatten().fieldErrors,
            });
        }
        // Prisma Error
        if (error instanceof prisma_1.Prisma.PrismaClientKnownRequestError) {
            return res.status(400).json({
                meta: {
                    status: 400,
                    message: error.message,
                },
                data: {
                    code: error.code,
                },
            });
        }
        // Error bawaan JS
        if (error instanceof Error) {
            return res.status(500).json({
                meta: {
                    status: 500,
                    message: error.message,
                },
                data: null,
            });
        }
        return res.status(500).json({
            meta: {
                status: 500,
                message,
            },
            data: null,
        });
    },
    unauthorized(res, message) {
        return res.status(403).json({
            meta: {
                status: 403,
                message,
            },
            data: null,
        });
    },
    notFound(res, message) {
        return res.status(404).json({
            meta: {
                status: 404,
                message,
            },
            data: null,
        });
    },
    // pagination(
    // 	res: Response,
    // 	data: unknown[],
    // 	pagination: Pagination,
    // 	message: string
    // ) {
    // 	return res.status(200).json({
    // 		meta: {
    // 			status: 200,
    // 			message,
    // 		},
    // 		data,
    // 		pagination,
    // 	});
    // },
};
//# sourceMappingURL=response.js.map