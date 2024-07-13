//Orden para agregar las librerias del environment y protocolo de comunicacion de mensajes
// npm install stompit dotenv
const stompit = require('stompit');
require('dotenv').config();

//Configuracion de conexion
const connectOptions = {
  host: process.env.ACTIVEMQ_HOST,
  port: process.env.ACTIVEMQ_PORT,
  connectHeaders: {
    host: '/',
    login: process.env.ACTIVEMQ_USER,
    passcode: process.env.ACTIVEMQ_PASSWORD,
    'heart-beat': '5000,5000'
  }
};

//Conexion al broker
stompit.connect(connectOptions, (error, client) => {
  //Control de errores
  if (error) {
    console.error('Connect error: ' + error.message);
    return;
  }

  //Cabecera del mensaje
  const sendHeaders = {
    destination: process.env.ACTIVEMQ_QUEUE,
    'content-type': 'text/plain'
  };

  //Envio del mensaje
  const frame = client.send(sendHeaders);
  frame.write('Mensaje 02');
  frame.end();

  console.log('Mensaje enviado.');

  client.disconnect();
});

