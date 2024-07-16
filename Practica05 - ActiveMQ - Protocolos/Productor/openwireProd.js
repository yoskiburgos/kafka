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

  const sendHeaders = {
    'destination': '/queue/test',
    'content-type': 'text/plain'
  };

  const frame = client.send(sendHeaders);
  frame.write('Hola, ActiveMQ!');
  frame.end();

  console.log('Mensaje enviado a la cola');

  client.disconnect();
});
