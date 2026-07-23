"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const building_controller_1 = __importDefault(require("../controller/building.controller"));
const space_controller_1 = __importDefault(require("../controller/space.controller"));
const region_controller_1 = __importDefault(require("../controller/region.controller"));
const media_middleware_1 = __importDefault(require("../middleware/media.middleware"));
const media_controller_1 = __importDefault(require("../controller/media.controller"));
const facility_controller_1 = __importDefault(require("../controller/facility.controller"));
const occupancy_controller_1 = __importDefault(require("../controller/occupancy.controller"));
const occupancy_middleware_1 = __importDefault(require("../middleware/occupancy.middleware"));
const device_controller_1 = __importDefault(require("../controller/device.controller"));
const occupancyAnalitic_controller_1 = __importDefault(require("../controller/analitics/occupancyAnalitic.controller"));
const router = express_1.default.Router();
router.post("/auth/login", auth_controller_1.default.login);
router.get("/auth/me", auth_controller_1.default.aboutMe);
router.post("/auth/activation/:token", auth_controller_1.default.activation);
router.post("/auth/register", user_controller_1.default.createGeneralUser);
router
    .route("/user")
    .get(auth_middleware_1.default, user_controller_1.default.findUser)
    .post(auth_middleware_1.default, user_controller_1.default.createUser);
router
    .route("/user/:id")
    .get(auth_middleware_1.default, user_controller_1.default.findUserById)
    .put(auth_middleware_1.default, user_controller_1.default.updateUser)
    .delete(auth_middleware_1.default, user_controller_1.default.delete);
router
    .route("/building")
    .get(auth_middleware_1.default, building_controller_1.default.findAll)
    .post(auth_middleware_1.default, building_controller_1.default.create);
router
    .route("/building/:id")
    .get(auth_middleware_1.default, building_controller_1.default.findOne)
    .put(auth_middleware_1.default, building_controller_1.default.update)
    .delete(auth_middleware_1.default, building_controller_1.default.delete);
router
    .route("/space")
    .get(auth_middleware_1.default, space_controller_1.default.findAll)
    .post(auth_middleware_1.default, space_controller_1.default.create);
router
    .route("/space/:id")
    .get(auth_middleware_1.default, space_controller_1.default.findOne)
    .put(auth_middleware_1.default, space_controller_1.default.update)
    .delete(auth_middleware_1.default, space_controller_1.default.delete);
router
    .route("/region/provinces")
    .get(auth_middleware_1.default, region_controller_1.default.getProvinces);
router
    .route("/region/regencies/:provinceId")
    .get(auth_middleware_1.default, region_controller_1.default.getRegencies);
router
    .route("/region/districts/:regencyId")
    .get(auth_middleware_1.default, region_controller_1.default.getDistricts);
router
    .route("/region/villages/:districtId")
    .get(auth_middleware_1.default, region_controller_1.default.getVillages);
router.route("/region/city").get(auth_middleware_1.default, region_controller_1.default.findByCity);
router
    .route("/facility")
    .get(auth_middleware_1.default, facility_controller_1.default.findAll)
    .post(auth_middleware_1.default, facility_controller_1.default.create);
router
    .route("/facility/:id")
    .get(auth_middleware_1.default, facility_controller_1.default.findOne)
    .put(auth_middleware_1.default, facility_controller_1.default.update)
    .delete(auth_middleware_1.default, facility_controller_1.default.delete);
router
    .route("/device")
    .get(auth_middleware_1.default, device_controller_1.default.findAll)
    .post(auth_middleware_1.default, device_controller_1.default.create);
router
    .route("/device/:id")
    .get(auth_middleware_1.default, device_controller_1.default.findOne)
    .put(auth_middleware_1.default, device_controller_1.default.update)
    .delete(auth_middleware_1.default, device_controller_1.default.delete);
router
    .route("/occupancy")
    .get(auth_middleware_1.default, occupancy_controller_1.default.findAll)
    .post(occupancy_middleware_1.default, occupancy_controller_1.default.create);
router
    .route("/occupancy/:spaceId")
    .get(auth_middleware_1.default, occupancy_controller_1.default.findBySpace);
router.post("/media/upload-single", [auth_middleware_1.default, media_middleware_1.default.single("file")], media_controller_1.default.single);
router.post("/media/upload-multiple", [auth_middleware_1.default, media_middleware_1.default.single("files")], media_controller_1.default.multiple);
router.delete("/media/remove", auth_middleware_1.default, media_controller_1.default.remove);
router.get("/analytics/occupancy/trend", occupancyAnalitic_controller_1.default.trend);
router.get("/analytics/occupancy/summary", occupancyAnalitic_controller_1.default.summary);
router.get("/analytics/occupancy/peak-hour", occupancyAnalitic_controller_1.default.peakHour);
router.get("/analytics/occupancy/status", occupancyAnalitic_controller_1.default.status);
router.get("/analytics/occupancy/utilization", occupancyAnalitic_controller_1.default.utilization);
router.get("/analytics/occupancy/top-spaces", occupancyAnalitic_controller_1.default.topSpaces);
exports.default = router;
//# sourceMappingURL=api.js.map