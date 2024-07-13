const stompit = require('stompit');
require('dotenv').config();

// Configuracion
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

//Conexion
stompit.connect(connectOptions, (error, client) => {
  if (error) {
    console.error('Connect error: ' + error.message);
    return;
  }

  //Conexion a la cola
  const subscribeHeaders = {
    destination: process.env.ACTIVEMQ_QUEUE,
    ack: 'client-individual'
  };

  //Asociacion a la cola
  client.subscribe(subscribeHeaders, (error, message) => {
    if (error) {
      console.error('Subscribe error: ' + error.message);
      return;
    }

    //Lectura de los mensajes
    message.readString('utf-8', (error, body) => {
      if (error) {
        console.error('Error en la lectura: ' + error.message);
        return;
      }

      console.log('Recibiendo: ' + body);

      client.ack(message);

      //client.disconnect();
    });
  });
});
