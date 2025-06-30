import { model, Schema, Types } from "mongoose";

const rideSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: "Auth",
            required: true,
            index: true,
        },
        captainId: {
            type: Types.ObjectId,
            ref: "Captain",
            default: null,
        },
        pickup: {
            type: String,
            required: true,
        },
        destination: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: [
                "requested",
                "accepted",
                "started",
                "completed",
                "cancelled",
            ],
            default: "requested",
        },
    },
    { timestamps: true }
);

const Ride = model("Ride", rideSchema);

export default Ride;
