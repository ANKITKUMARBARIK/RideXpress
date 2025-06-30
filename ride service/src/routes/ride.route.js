import { Router } from "express";
import {
    createRide,
    acceptRide,
    getAllRides,
} from "../controllers/ride.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { createRideSchema } from "../validations/ride.validation.js";

const router = Router();

router.route("/create-ride").post(validate(createRideSchema), createRide);

router.route("/accept-ride/:rideId").patch(acceptRide);

router.route("/get-all-rides").get(getAllRides);

export default router;
