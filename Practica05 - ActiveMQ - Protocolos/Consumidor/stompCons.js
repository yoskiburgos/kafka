//npm install stomp-client

const Stomp = require('stomp-client');

const destination = '/queue/test';
const client = new Stomp('127.0.0.1', 61613, 'admin', 'admin');

client.connect(function(sessionId) {
    console.log('Connected to ActiveMQ');

    client.subscribe(destination, (body, headers) => {
        console.log('Received message: ' + body);
    });

    // Mantén la conexión abierta para seguir recibiendo mensajes
});
