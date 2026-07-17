import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "./env";
import multer from "multer";

cloudinary.config({
	cloud_name: CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET
})

// fungsi ini digunakan untuk mengubah file hasil upload dari multer yg berbentuk buffer menjadi string
const toDataURL = (file: Express.Multer.File) => {
	const b64 = Buffer.from(file.buffer).toString("base64")
	const dataURL = `data:${file.mimetype};base64,${b64}`
	return dataURL
}

// fungsi ini digunakan untuk mengambil public id untuk melakukan delete file dalam cloudinary
const getPublicIdFromDataUrl = (fileUrl: string) => {
	const lastUrlFileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1)
	const publicId = lastUrlFileName.substring(0, lastUrlFileName.lastIndexOf("."))
	return publicId
}

export default {
	async uploadSingle (file: Express.Multer.File) {
		const fileDataUrl = toDataURL(file)

		const result = await cloudinary.uploader.upload(fileDataUrl, {
			resource_type: "auto"
		})

		return result
	},

	async uploadMultiple (files: Express.Multer.File[]) {
		const uploadBatch = files.map((items) => {
			const result = this.uploadSingle(items)
			return result
		})

		const results = Promise.all(uploadBatch)
		return results
	},

	async remove (fileUrl: string) {
		const publicId = getPublicIdFromDataUrl(fileUrl)

		const result = await cloudinary.uploader.destroy(publicId)
		return result
	}

}