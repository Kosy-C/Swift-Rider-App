"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const riderController_1 = require("../controller/riderController");
const authorization_1 = require("../middleware/authorization");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
// router.post('/login', login)
router.post('/riders-signup', multer_1.upload.array('image', 3), riderController_1.registerRider);
router.patch('/update-rider/:signature', authorization_1.authRider, riderController_1.updateRiderProfile);
router.post('/verify/:signature', authorization_1.authRider, riderController_1.VerifyUser);
router.get('/resend-otp/:signature', authorization_1.authRider, riderController_1.ResendOTP);
router.post('/delivery-verify/:orderId', authorization_1.authRider, riderController_1.VerifyDeliveryOtp);
router.get('/delivery-resend-otp/:orderId', authorization_1.authRider, riderController_1.DeliveryResendOTP);
router.get('/rider-order-profile/:riderId', authorization_1.authRider, riderController_1.getRiderProfile);
router.get("/all-biddings", authorization_1.authRider, riderController_1.getAllBiddings);
router.get("/rider-history", authorization_1.authRider, riderController_1.RiderHistory);
router.get('/get-order-byId/:orderId', authorization_1.authRider, riderController_1.getUserOrderById);
router.patch("/accept-bid/:orderId", authorization_1.authRider, riderController_1.acceptBid);
router.get('/get-order-owner-name-byId/:orderOwnerId', authorization_1.authRider, riderController_1.getOrderOwnerNameById);
exports.default = router;
