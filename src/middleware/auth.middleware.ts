import { IReqUser, IUserToken } from "../utils/interface"
import { NextFunction, Request, Response } from "express"
import response from "../utils/response"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../utils/env"

export const getUserData = (token: string) => {
	const user = jwt.verify(token, JWT_SECRET) as IUserToken
	return user
}

export default (req: Request, res: Response, next: NextFunction) => {
	const authorization = req.headers?.authorization

	if(!authorization) {
		return response.unauthorized(res, "unauthorized")
	}

	const [ prefix, token ] = authorization.split(" ")
	if (!(prefix === "Bearer" && token)) {
		return response.unauthorized(res, "unauthorized");
	}
	let user;
	try {
		user = getUserData(token)
	} catch (error) {
		return response.unauthorized(res, "unauthorized");
	}
	if(!user) {
		return response.unauthorized(res, "unauthorized");
	}

	(req as IReqUser).user = user;

	next();
}