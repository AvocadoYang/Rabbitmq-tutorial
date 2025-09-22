import amqp from "amqplib";

const RABBIT_URL = "amqp://kenmec:kenmec@192.168.1.122:5672";
const QUEUE_NAME = "task_queue";
const MSG = "Hello Quorum Queue!";
const INTERVAL_MS = 3000;

async function startProducer() {
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
        setTimeout(connect, 3000);
      });

      channel = await conn.createChannel();

      channel.on("error", (err) => {
        console.error("Channel error:", err.message);
      });

      channel.on("close", () => {
        console.warn("Channel closed, reconnecting...");
        setTimeout(connect, 3000);
      });

      // await channel.assertQueue(QUEUE_NAME, {
      //   durable: true,
      //   arguments: { "x-queue-type": "quorum" },
      // });

      // console.log(" [*] Producer started, sending messages every", INTERVAL_MS, "ms");

      // // 持續發送訊息
      // setInterval(() => {
      //   try {
      //     channel.sendToQueue(QUEUE_NAME, Buffer.from(MSG), { persistent: true });
      //     console.log(" [x] Sent '%s'", MSG);
      //   } catch (err) {
      //     console.error("Send message error:", err);
      //   }
      // }, INTERVAL_MS);
    } catch (err) {
      console.error("Failed to connect, retrying in 3s...", err);
      setTimeout(connect, 3000);
    }
  }

  connect();
}

startProducer().catch(console.error);
