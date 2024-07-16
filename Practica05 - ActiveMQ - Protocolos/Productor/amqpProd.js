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

    // Crear un remitente (sender)
    const sender = connection.open_sender('cola.ejemplo');

    sender.on('sendable', () => {
        // Enviar un mensaje
        const message = {
            body: 'Hola desde el productor'
        };
        sender.send(message);
        console.log('Mensaje enviado:', message.body);
        connection.close();
    });
});

connection.on('disconnected', () => {
    console.log('Desconectado');
});
