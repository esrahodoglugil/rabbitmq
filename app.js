const express = require('express');
const app = express();
const createConnection = require('./rabbitMqConnection');
require('./consumer')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mesaj gönderme fonksiyonu
const sendMessage = async (queueName, message) => {
    const connection = await createConnection();
    if (!connection) {
      console.error("RabbitMQ bağlantısı başarısız.");
      return false;
    }
  
    const channel = await connection.createChannel(); // Tek bir bağlantıdan yeni kanal oluşturulabilir
    await channel.assertQueue(queueName, { durable: true });
  
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`Mesaj kuyruğa gönderildi: ${queueName}`);
    return true;
  };
  

// Mesaj gönderme API'si
app.post('/api/send-message', async (req, res) => {
  const { queueName, message } = req.body;

  const data = {
    queueName,
    message,
    date: new Date().toLocaleString(),
  };

  const result = await sendMessage(queueName, data);

  if (result) {
    res.status(200).json({ success: true, data });
  } else {
    res.status(500).json({ success: false, error: 'Mesaj gönderilemedi.' });
  }
});

const port = 3005;

app.listen(port, () => console.log(`Server started on port ${port}`));
