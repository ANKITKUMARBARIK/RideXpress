import { pendingCaptainPolls } from "../utils/pendingRequests.util.js";

export const handleRideCreatedEvent = async (data) => {
    try {
        // const { _id, userId, captainId, pickup, destination, status } = data;

        console.log("📥 New ride received:", data);

        pendingCaptainPolls.forEach(({ res, timeoutId }) => {
            clearTimeout(timeoutId);
            res.status(200).json({
                message: "🚕 New ride available",
                ride: data,
            });
        });

        pendingCaptainPolls.length = 0;
    } catch (error) {
        console.error(
            "Error while handling ride.created event:",
            error?.message
        );
    }
};
