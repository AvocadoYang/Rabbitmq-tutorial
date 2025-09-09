import amqplib from 'amqplib';

const queue = "task_queue";
const msg = process.argv.slice(2).join(' ') || "H.e.l.l.o World";


(async() => {
    const connect = await amqplib.connect("amqp://kenmec:kenmec@localhost");

    const ch = await connect.createChannel();

    ch.assertQueue(queue, { durable: false});
    
    ch.sendToQueue(queue, Buffer.from(msg), { persistent: true});
    
    console.log("[x] Sent '%s'", msg);

    setInterval(() => {

    }, 3000)
})()