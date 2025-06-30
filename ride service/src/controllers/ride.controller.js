import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/ApiError.util.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import { sanitizeRide } from "../utils/ride.util.js";
import publishMessage from "../rabbitmq/publish.js";
import Ride from "../models/ride.model.js";

export const createRide = asyncHandler(async (req, res) => {
    const { pickup, destination } = req.body;

    const ride = new Ride({
        userId: req.user?._id,
        pickup,
        destination,
    });
    await ride.save();

    const existedRide = await sanitizeRide(ride._id);
    if (!existedRide)
        throw new ApiError(500, "something went wrong while create the ride");

    await publishMessage("ride_exchange", "ride.created", existedRide);

    return res
        .status(201)
        .json(new ApiResponse(201, existedRide, "ride created successfully"));
});

export const acceptRide = asyncHandler(async (req, res) => {
    const { rideId } = req.params;
    const { captainId } = req.body;

    const existedRide = await Ride.findById(rideId);
    if (!existedRide) throw new ApiError(404, "ride not found");

    if (existedRide.status !== "requested") {
        throw new ApiError(400, "ride already accepted");
    }

    existedRide.status = "accepted";
    existedRide.captainId = captainId;

    await existedRide.save();

    await publishMessage("ride_exchange", "ride.accepted", {
        rideId: existedRide._id,
        captainId,
        userId: existedRide.userId,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, existedRide, "ride accepted successfully"));
});

export const getAllRides = asyncHandler(async (req, res) => {
    const rides = await Ride.find({}).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, rides, "all rides fetched successfully"));
});
