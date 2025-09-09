import amqplib from 'amqplib';
const queue = "test-queue";
const msg = "hello world";

(async () => {

        const conn = await amqplib.connect('amqp://guest:guest@localhost');
    
       const ch1 = await conn.createChannel();
       ch1.assertQueue(queue, {
            durable: false
       });

       setInterval(() => {
           ch1.sendToQueue(queue, Buffer.from(msg));
       }, 3000)

       console.log("[x] sent %s", msg)
       

})();


