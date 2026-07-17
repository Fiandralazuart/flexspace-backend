import express from "express"
import authController from "../controller/auth.controller"
import authMiddleware from "../middleware/auth.middleware"
import userController from "../controller/user.controller"
import buildingController from "../controller/building.controller"
import spaceController from "../controller/space.controller"
import regionController from "../controller/region.controller"
import mediaMiddleware from "../middleware/media.middleware"
import mediaController from "../controller/media.controller"


const router = express.Router()

router.post("/auth/login", authController.login)
router.post("/auth/activation/:token", authController.activation)

router.post("/register",  userController.createGeneralUser)
router.route("/user")
.get(authMiddleware, userController.findUser)
.post(authMiddleware, userController.createUser)
router.route("/user/:id")
.get(authMiddleware, userController.findUserById)
.put(authMiddleware, userController.updateUser)
.delete(authMiddleware, userController.delete)


router.route("/building")
.get(authMiddleware, buildingController.findAll)
.post(authMiddleware, buildingController.create)
router.route("/building/:id")
.get(authMiddleware, buildingController.findOne)
.put(authMiddleware, buildingController.update)
.delete(authMiddleware, buildingController.delete)

router.route("/space")
.get(authMiddleware, spaceController.findAll)
.post(authMiddleware, spaceController.create)
router.route("/space/:id")
.get(authMiddleware, spaceController.findOne)
.put(authMiddleware, spaceController.update)
.delete(authMiddleware, spaceController.delete)

router.route("/region/provinces")
.get(authMiddleware, regionController.getProvinces);
router.route("/region/regencies/:provinceId")
.get(authMiddleware, regionController.getRegencies);
router.route("/region/districts/:regencyId")
.get(authMiddleware, regionController.getDistricts);
router.route("/region/villages/:districtId")
.get(authMiddleware, regionController.getVillages);
router.route("/region/city")
.get(authMiddleware, regionController.findByCity);


router.post("/media/upload-single", [authMiddleware, mediaMiddleware.single("file")], mediaController.single)
router.post("/media/upload-multiple", [authMiddleware, mediaMiddleware.single("files")], mediaController.multiple)
router.delete("/media/remove", authMiddleware, mediaController.remove)

export default router