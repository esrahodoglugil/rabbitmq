const createConnection = require("./rabbitMqConnection");

const consumer = async (queueName) => {
  const connection = await createConnection();
  if (!connection) {
    console.error("RabbitMQ bağlantısı başarısız.");
    return;
  }

  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });

  await channel.consume(queueName, (msg) => {
    const data = JSON.parse(msg.content.toString());
    console.log("RabbitMQ'dan alınan mesaj:", data);

    // Mesaj başarıyla işlendiği için kuyruğa onay gönderilir
    channel.ack(msg);
  });

  console.log(`Consumer ${queueName} kuyruğunu dinliyor.`);
};

// Consumer'ı başlat
consumer("kuyruk-1"); // Kuyruk adını buraya girin
