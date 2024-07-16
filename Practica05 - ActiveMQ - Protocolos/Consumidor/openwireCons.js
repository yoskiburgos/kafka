//npm install stompit

const stompit = require('stompit');

const connectOptions = {
  'host': 'localhost', // Cambia esto a la dirección de tu servidor ActiveMQ
  'port': 61613,       // Puerto por defecto de STOMP
  'connectHeaders': {
    'host': '/',
    'login': 'admin',   // Usuario de ActiveMQ
    'passcode': 'admin' // Contraseña de ActiveMQ
  }
};

stompit.connect(connectOptions, (error, client) => {
  if (error) {
    console.log('Error de conexión: ' + error.message);
    return;
  }

  const subscribeHeaders = {
    'destination': '/queue/test',
    'ack': 'client-individual'
  };

  client.subscribe(subscribeHeaders, (error, message) => {
    if (error) {
      console.log('Error de suscripción: ' + error.message);
      return;
    }

    message.readString('utf-8', (error, body) => {
      if (error) {
        console.log('Error de lectura del mensaje: ' + error.message);
        return;
      }

      console.log('Mensaje recibido: ' + body);

      client.ack(message);
    });
  });
});
