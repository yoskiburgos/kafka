//npm install mqtt

const mqtt = require('mqtt');

// Configuración del cliente MQTT
const options = {
  host: 'localhost',   // Dirección del servidor ActiveMQ
  port: 1883,                     // Puerto MQTT (por defecto 1883)
  protocol: 'mqtt',               // Protocolo MQTT
  username: 'admin',         // Usuario para autenticación
  password: 'admin'       // Contraseña para autenticación
};

// Crear cliente MQTT
const client = mqtt.connect(options);

client.on('connect', () => {
  console.log('Conectado a ActiveMQ');

  // Suscribirse a un topic
  const topic = 'miTopic';

  client.subscribe(topic, (err) => {
    if (err) {
      console.error('Error al suscribirse al topic:', err);
    } else {
      console.log('Suscrito al topic:', topic);
    }
  });
});

client.on('message', (topic, message) => {
  // Mensaje recibido
  console.log(`Mensaje recibido en el topic ${topic}: ${message.toString()}`);
});

client.on('error', (err) => {
  console.error('Error de conexión:', err);
});
