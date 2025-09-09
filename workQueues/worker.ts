import amqplib from 'amqplib';
const queue = "task_queue";

(async() => {
        const connect = await amqplib.connect("amqp://kenmec:kenmec@localhost");
    
        const ch = await connect.createChannel();

        ch.assertQueue(queue, { durable: false});

        ch.consume(queue, (msg) =>{
            if(!msg) return;
            const secs = msg.content.toString().split('.').length -1;

            console.log("[x] Received %s", msg.content.toString());
            setTimeout(() => {
                console.log("[x] Done");
                ch.ack(msg);
            }, secs * 1000)
        }, {
            noAck: false
        });
})();