import amqp from "amqplib";

const RABBIT_URL = "amqp://kenmec:kenmec@192.168.1.122:5672";
const QUEUE_NAME = "task_queue";

async function startConsumer() {
  let conn;
  let channel: amqp.Channel;

  async function connect() {
    try {
      conn = await amqp.connect(RABBIT_URL);

      conn.on("error", (err) => {
        console.error("Connection error:", err.message);
      });

      conn.on("close", () => {
        console.warn("Connection closed, retrying in 3s...");
        setTimeout(connect, 3000); // 自動重連
      });   

      channel = await conn.createChannel();

      channel.on("error", (err) => {
        console.error("Channel error:", err.message);
      });

      channel.on("close", () => {
        console.warn("Channel closed, reconnecting...");
        setTimeout(connect, 3000); // 自動重連
      });

      await channel.assertQueue(QUEUE_NAME, {
        durable: true,
        arguments: { "x-queue-type": "quorum" },
      });

      console.log(" [*] Waiting for messages. To exit press CTRL+C");

      await channel.consume(
        QUEUE_NAME,
        (msg) => {
          if (msg) {
            console.log(" [x] Received %s", msg.content.toString());
            channel.ack(msg);
          }
        },
        { noAck: false }
      );
    } catch (err) {
      console.error("Failed to connect, retrying in 3s...", err);
      setTimeout(connect, 3000); // 連線失敗也自動重連
    }
  }

  connect();
}

startConsumer().catch(console.error);
