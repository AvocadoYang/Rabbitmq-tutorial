import amqplib from 'amqplib';

(async () => {
    const connect = await amqplib.connect("amqp://kenmec:kenmec@localhost");
        
    const ch = await connect.createChannel();
    ch.assertExchange("logs", "fanout", { durable: false});
    ch.publish('logs', '', Buffer.from('Hello world'));
})()