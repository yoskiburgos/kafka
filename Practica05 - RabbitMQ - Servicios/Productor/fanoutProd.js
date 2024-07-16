//npm install amqplib express body-parser
const amqp = require('amqplib/callback_api');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const RABBITMQ_URL = 'amqp://admin:admin@localhost:5672';
const EXCHANGE_NAME = 'fanout_logs';

amqp.connect(RABBITMQ_URL, function(error0, connection) {
  if (error0) {
    throw error0;
  }

  app.post('/produce', (req, res) => {
    const message = req.body.message;

    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }

      channel.assertExchange(EXCHANGE_NAME, 'fanout', {
        durable: false
      });

      channel.publish(EXCHANGE_NAME, '', Buffer.from(message));
      console.log(" Enviado: '%s'", message);
    });

    res.send('Mensaje Enviado');
  });

  app.listen(3000, () => {
    console.log('Corriendo en 3000');
  });
});
