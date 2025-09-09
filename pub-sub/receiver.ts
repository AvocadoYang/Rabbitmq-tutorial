import amqplib from 'amqplib';

(async() => {
        const conn = await amqplib.connect('amqp://kenmec:kenmec@localhost');
        
        const ch1 = await conn.createChannel();
        const q = await ch1.assertQueue('', {
            exclusive: true
          });
        ch1.bindQueue(q.queue, 'logs', '')
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C");
        ch1.consume(q.queue, (msg) => {
            if(msg?.content){
                console.log("[x] %s", msg.content.toString());
            }
        })
        
})()