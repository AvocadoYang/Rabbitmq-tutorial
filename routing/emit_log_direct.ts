import amqplib from 'amqplib';
const exchange = "direct_logs";

(async() => {
    const connect = await amqplib.connect('amqp://kenmec:kenmec@localhost');
    const ch = await connect.createChannel();
    const args = process.argv.slice(2);
    const msg = args.slice(1).join(' ') || "hello world";
    const severity = (args.length > 0) ? args[0] : "info";

    ch.assertExchange(exchange, "direct", {
        durable: false
    });

    ch.publish(exchange, severity, Buffer.from(msg));
    console.log(" [x] Sent %s: '%s'", severity, msg);
    
})()