import amqplib from 'amqplib';
const exchange = "direct_logs";

const args = process.argv.slice(2);

if (args.length == 0) {
    console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
    process.exit(1);
  }


(async () => {
                    
    const connect = await amqplib.connect("amqp://kenmec:kenmec@localhost");
    const ch = await connect.createChannel();

    ch.assertExchange(exchange, 'direct', {
        durable: false
    });

    const q = await ch.assertQueue('', {
        exclusive: true
    });

    console.log("[*] Waiting for logs. To exit press CTRL+C");

    args.forEach((severity) =>{
        ch.bindQueue(q.queue, exchange, severity);
    });

    ch.consume(q.queue, (msg)=>{
        if(msg)
            console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
    }, {
        noAck: true
    })
})()