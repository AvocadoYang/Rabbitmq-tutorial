import amqplib from 'amqplib';
const queue = "test-queue";


(async() => {
        const conn = await amqplib.connect('amqp://kenmec:kenmec@localhost');
        
        const ch1 = await conn.createChannel();
        await ch1.assertQueue(queue, {
            durable: false
          });


        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        ch1.consume(queue, function(msg) {
          console.log('??????')
            if(!msg) return;
            console.log(" [x] Received %s", msg.content.toString());
          }, {
              noAck: true
          });
})()