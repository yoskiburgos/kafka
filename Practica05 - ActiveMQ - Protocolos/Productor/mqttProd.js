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

  // Publicar un mensaje en un topic
  const topic = 'miTopic';
  const message = 'Hola desde Node.js con MQTT';

  client.publish(topic, message, (err) => {
    if (err) {
      console.error('Error al publicar el mensaje:', err);
    } else {
      console.log('Mensaje publicado:', message);
    }

    // Cerrar la conexión
    client.end();
  });
});

client.on('error', (err) => {
  console.error('Error de conexión:', err);
});
