const amqplib = require("amqplib");

let connection = null;

async function createConnection() {
  if (connection) {
    // Eğer bağlantı zaten varsa, onu kullan
    return connection;
  }

  try {
    const connectionString = "amqp://esrahodoglugil:123456789@localhost:5672/";
    connection = await amqplib.connect(connectionString);
    console.log("RabbitMQ'ya bağlantı başarılı.");
    return connection;
  } catch (error) {
    console.error("RabbitMQ bağlantı hatası: ", error);
    return null;
  }
}

module.exports = createConnection;
