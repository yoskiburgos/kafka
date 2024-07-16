//npm install amqplib express body-parser
const amqp = require('amqplib/callback_api');
const express = require('express');

const app = express();

const RABBITMQ_URL = 'amqp://admin:admin@localhost:5672';
const EXCHANGE_NAME = 'fanout_logs';
const QUEUE_NAME = 'cola_fanout'; 

let messages = [];

amqp.connect(RABBITMQ_URL, function(error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertExchange(EXCHANGE_NAME, 'fanout', {
      durable: false
    });

    channel.assertQueue(QUEUE_NAME, {
      //Cola exclusiva
      exclusive: true
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }

      console.log(' Esperando.... para salir:  CTRL+C', q.queue);

      channel.bindQueue(q.queue, EXCHANGE_NAME, '');

      channel.consume(q.queue, function(msg) {
        if (msg.content) {
          const messageContent = msg.content.toString();
          console.log(" Recibido: '%s'", messageContent);
          messages.push(messageContent);
        }
      }, {
        noAck: true
      });
    });
  });

  app.get('/consume', (req, res) => {
    res.json(messages);
    messages = [];
  });

  app.listen(3001, () => {
    console.log('Corriendo en 3001');
  });
});
