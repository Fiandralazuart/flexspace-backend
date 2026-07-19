import { Request, Response, NextFunction } from "express";
import response from "../utils/response";

export default function iotMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const apiKey = req.header("x-api-key");

	if (!apiKey) {
		return response.unauthorized(
			res,
			"API Key is required"
		);
	}

	if (apiKey !== process.env.OCCUPANCY_API_KEY) {
		return response.unauthorized(
			res,
			"Invalid API Key"
		);
	}

	next();
}