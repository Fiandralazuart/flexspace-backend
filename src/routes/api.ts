import express from "express";
import authController from "../controller/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import userController from "../controller/user.controller";
import buildingController from "../controller/building.controller";
import spaceController from "../controller/space.controller";
import regionController from "../controller/region.controller";
import mediaMiddleware from "../middleware/media.middleware";
import mediaController from "../controller/media.controller";
import facilityController from "../controller/facility.controller";
import occupancyController from "../controller/occupancy.controller";
import iotMiddleware from "../middleware/occupancy.middleware";
import deviceController from "../controller/device.controller";
import occupancyAnaliticController from "../controller/analitics/occupancyAnalitic.controller";

const router = express.Router();

router.post("/auth/login", authController.login);
router.get("/auth/me", authController.aboutMe);
router.post("/auth/activation/:token", authController.activation);
router.post("/auth/register", userController.createGeneralUser);

router
	.route("/user")
	.get(authMiddleware, userController.findUser)
	.post(authMiddleware, userController.createUser);
router
	.route("/user/:id")
	.get(authMiddleware, userController.findUserById)
	.put(authMiddleware, userController.updateUser)
	.delete(authMiddleware, userController.delete);

router
	.route("/building")
	.get(authMiddleware, buildingController.findAll)
	.post(authMiddleware, buildingController.create);
router
	.route("/building/:id")
	.get(authMiddleware, buildingController.findOne)
	.put(authMiddleware, buildingController.update)
	.delete(authMiddleware, buildingController.delete);

router
	.route("/space")
	.get(authMiddleware, spaceController.findAll)
	.post(authMiddleware, spaceController.create);
router
	.route("/space/:id")
	.get(authMiddleware, spaceController.findOne)
	.put(authMiddleware, spaceController.update)
	.delete(authMiddleware, spaceController.delete);

router
	.route("/region/provinces")
	.get(authMiddleware, regionController.getProvinces);
router
	.route("/region/regencies/:provinceId")
	.get(authMiddleware, regionController.getRegencies);
router
	.route("/region/districts/:regencyId")
	.get(authMiddleware, regionController.getDistricts);
router
	.route("/region/villages/:districtId")
	.get(authMiddleware, regionController.getVillages);
router.route("/region/city").get(authMiddleware, regionController.findByCity);

router
	.route("/facility")
	.get(authMiddleware, facilityController.findAll)
	.post(authMiddleware, facilityController.create);
router
	.route("/facility/:id")
	.get(authMiddleware, facilityController.findOne)
	.put(authMiddleware, facilityController.update)
	.delete(authMiddleware, facilityController.delete);

router
	.route("/device")
	.get(authMiddleware, deviceController.findAll)
	.post(authMiddleware, deviceController.create);

router
	.route("/device/:id")
	.get(authMiddleware, deviceController.findOne)
	.put(authMiddleware, deviceController.update)
	.delete(authMiddleware, deviceController.delete);

router
	.route("/occupancy")
	.get(authMiddleware, occupancyController.findAll)
	.post(iotMiddleware, occupancyController.create);
router
	.route("/occupancy/:spaceId")
	.get(authMiddleware, occupancyController.findBySpace);

router.post(
	"/media/upload-single",
	[authMiddleware, mediaMiddleware.single("file")],
	mediaController.single,
);
router.post(
	"/media/upload-multiple",
	[authMiddleware, mediaMiddleware.single("files")],
	mediaController.multiple,
);
router.delete("/media/remove", authMiddleware, mediaController.remove);


router.get("/analytics/occupancy/trend", occupancyAnaliticController.trend);
router.get("/analytics/occupancy/summary", occupancyAnaliticController.summary);
router.get("/analytics/occupancy/peak-hour", occupancyAnaliticController.peakHour);
router.get("/analytics/occupancy/status", occupancyAnaliticController.status);
router.get("/analytics/occupancy/utilization", occupancyAnaliticController.utilization);
router.get("/analytics/occupancy/top-spaces", occupancyAnaliticController.topSpaces);

export default router;
