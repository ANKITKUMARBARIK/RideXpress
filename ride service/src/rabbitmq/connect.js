import amqplib from "amqplib";

let channel;
let connection;

export const connectRabbitMQ = async () => {
    try {
        connection = await amqplib.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        // Ride Service publish ride_exchange to Captain Service
        await channel.assertExchange("ride_exchange", "topic", {
            durable: false,
        });
        console.log("✅ Connected to RabbitMQ (Ride Service)");

        // Ride Service consumes from captain_exchange
        // await channel.assertExchange("captain_exchange", "topic", {
        //     durable: false,
        // });
        // const { queue } = await channel.assertQueue("ride-service-queue");

        // await channel.bindQueue(
        //     queue,
        //     "captain_exchange",
        //     "captain.accepted"
        // );

        // channel.consume(queue, async (msg) => {
        //     try {
        //         const data = JSON.parse(msg.content.toString());
        //         const key = msg.fields.routingKey;

        //         if (key === "captain.accepted") {
        //             await handleRideAccepted(data);
        //         } else {
        //             console.log("⚠️ Unknown routing key:", key);
        //         }

        //         channel.ack(msg);
        //     } catch (err) {
        //         console.error("❌ Message handling error:", err.message);
        //         channel.ack(msg);
        //     }
        // });

        // Graceful shutdown
        process.on("SIGINT", async () => {
            await channel.close();
            await connection.close();
            console.log("❌ RabbitMQ connection closed gracefully");
            process.exit(0);
        });
    } catch (err) {
        console.error("❌ RabbitMQ Connection Error:", err.message);
    }
};

export const getChannel = () => channel;
