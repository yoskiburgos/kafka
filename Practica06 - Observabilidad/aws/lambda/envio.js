// sendMessage.js

const AWS = require('aws-sdk');
const sqs = new AWS.SQS({ region: 'us-east-1' });

exports.handler = async (event) => {
    const params = {
        MessageBody: JSON.stringify(event.body),
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/123456789012/MyQueue' // Reemplaza con tu URL de SQS
    };

    try {
        const data = await sqs.sendMessage(params).promise();
        console.log("Mensaje enviado con éxito:", data.MessageId);
        return {
            statusCode: 200,
            body: JSON.stringify({ messageId: data.MessageId }),
        };
    } catch (error) {
        console.error("Error enviando el mensaje:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "No se pudo enviar el mensaje" }),
        };
    }
};
