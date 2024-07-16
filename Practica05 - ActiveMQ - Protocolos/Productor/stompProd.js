//npm install stomp-client

const Stomp = require('stomp-client');

const destination = '/queue/test';
const client = new Stomp('127.0.0.1', 61613, 'admin', 'admin');

client.connect(function(sessionId) {
    console.log('Connected to ActiveMQ');

    const message = 'Hello, ActiveMQ!';
    client.publish(destination, message);
    console.log('Message sent: ' + message);

    client.disconnect(() => {
        console.log('Disconnected from ActiveMQ');
    });
});
