import Ride from "../models/ride.model.js";

export const sanitizeRide = async (rideId) => {
    return await Ride.findById(rideId);
};
