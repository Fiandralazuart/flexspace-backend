import { Response } from "express";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import uploader from "../utils/uploader";

export default {
	async single (req: IReqUser, res: Response) {
		try {
			console.log("in")
			console.log(req.file)
		if(!req.file) return response.error(res, null, "file are not exist")
			const result = await uploader.uploadSingle(req.file as Express.Multer.File)
			response.success(res, result, "Success to upload file")
		} catch (error) {
			response.error(res, error, "Failed to upload file")
		}
	},
	async multiple (req: IReqUser, res: Response) {
		try {
			if(!req.files || req.files.length === 0) return response.error(res, null, "files are not exist")
			const result = await uploader.uploadMultiple(req.files as Express.Multer.File[])
			response.success(res, result, "Success to upload files")
		} catch (error) {
			response.error(res, error, "Failed to upload files")
		}
	},
	async remove (req: IReqUser, res: Response) {
		try {
			const { fileUrl } = req.body as { fileUrl: string }
			console.log(fileUrl)
			const result = await uploader.remove(fileUrl)
			response.success(res, result, "Success to remove file")
		} catch (error) {
			response.error(res, error, "Failed to remove file")
		}
	},
}