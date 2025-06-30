import amqplib from "amqplib";
import { handleRideCreatedEvent } from "./handlers.js";

let channel;
let connection;

export const connectRabbitMQ = async () => {
    try {
        connection = await amqplib.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        // Captain Service publish captain_exchange to Ride Service
        await channel.assertExchange("captain_exchange", "topic", {
            durable: false,
        });
        console.log("✅ Connected to RabbitMQ (Captain Service)");

        // Captain Service consumes from ride_exchange
        await channel.assertExchange("ride_exchange", "topic", {
            durable: false,
        });
        const { queue } = await channel.assertQueue("captain-service-queue");

        await channel.bindQueue(queue, "ride_exchange", "ride.created");

        channel.consume(queue, async (msg) => {
            try {
                const data = JSON.parse(msg.content.toString());
                const key = msg.fields.routingKey;

                if (key === "ride.created") {
                    await handleRideCreatedEvent(data);
                } else {
                    console.log("⚠️ Unknown routing key:", key);
                }

                channel.ack(msg);
            } catch (err) {
                console.error("❌ Message handling error:", err.message);
                channel.ack(msg);
            }
        });

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
