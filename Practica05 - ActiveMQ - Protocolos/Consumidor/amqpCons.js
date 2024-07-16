//npm install rhea
const rhea = require('rhea');

// Configuración del servidor ActiveMQ
const connectionOptions = {
    host: 'localhost',
    port: 5672,
    username: 'admin',
    password: 'admin'
};

// Crear una conexión
const connection = rhea.connect(connectionOptions);

connection.on('connection_open', () => {
    console.log('Conexión abierta');

    // Crear un receptor (receiver)
    connection.open_receiver('cola.ejemplo');
});

connection.on('message', (context) => {
    const message = context.message;
    console.log('Mensaje recibido:', message.body);
    connection.close();
});

connection.on('disconnected', () => {
    console.log('Desconectado');
});
