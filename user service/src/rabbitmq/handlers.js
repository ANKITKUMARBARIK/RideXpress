import User from "../models/user.model.js";

export const handleAuthAccountCreate = async (data) => {
    try {
        const { userId, fullName, bio, avatar, coverImage, timezone } = data;

        const user = new User({
            userId,
            fullName,
            bio,
            avatar,
            coverImage,
            timezone,
        });

        await user.save();

        console.log("User profile created successfully in User Service");
    } catch (error) {
        console.error(
            "Error creating user profile in User Service:",
            error?.message
        );
    }
};

export const handlePasswordChangeResponse = async (data, key) => {
    try {
        const { userId, reason } = data;

        if (key === "auth.password.changed.success") {
            console.log(`[${userId}] Password changed: ${reason}`);
        } else if (key === "auth.password.changed.failed") {
            console.warn(`[${userId}] Password change failed: ${reason}`);
        } else {
            console.log("Unknown routing key received");
        }
    } catch (error) {
        console.error("Error handling password change event:", error?.message);
    }
};

export const handleRideAccepted = async (data) => {
    try {
        const { rideId, captainId, userId } = data;

        if (!rideId || !captainId || !userId) {
            console.warn("⚠️ Incomplete data received in ride.accepted event");
            return;
        }

        console.log(
            `Ride accepted: User (${userId}) | Ride (${rideId}) | Captain (${captainId})`
        );
    } catch (error) {
        console.error("Error in handleRideAccepted:", error.message);
    }
};
