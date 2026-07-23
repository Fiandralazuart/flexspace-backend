"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const env_1 = require("./env");
cloudinary_1.v2.config({
    cloud_name: env_1.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.CLOUDINARY_API_KEY,
    api_secret: env_1.CLOUDINARY_API_SECRET
});
// fungsi ini digunakan untuk mengubah file hasil upload dari multer yg berbentuk buffer menjadi string
const toDataURL = (file) => {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURL = `data:${file.mimetype};base64,${b64}`;
    return dataURL;
};
// fungsi ini digunakan untuk mengambil public id untuk melakukan delete file dalam cloudinary
const getPublicIdFromDataUrl = (fileUrl) => {
    const lastUrlFileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    const publicId = lastUrlFileName.substring(0, lastUrlFileName.lastIndexOf("."));
    return publicId;
};
exports.default = {
    async uploadSingle(file) {
        const fileDataUrl = toDataURL(file);
        const result = await cloudinary_1.v2.uploader.upload(fileDataUrl, {
            resource_type: "auto"
        });
        return result;
    },
    async uploadMultiple(files) {
        const uploadBatch = files.map((items) => {
            const result = this.uploadSingle(items);
            return result;
        });
        const results = Promise.all(uploadBatch);
        return results;
    },
    async remove(fileUrl) {
        const publicId = getPublicIdFromDataUrl(fileUrl);
        const result = await cloudinary_1.v2.uploader.destroy(publicId);
        return result;
    }
};
//# sourceMappingURL=uploader.js.map