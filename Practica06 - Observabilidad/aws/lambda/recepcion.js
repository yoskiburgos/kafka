// receiveMessage.js

const AWS = require('aws-sdk');
const sqs = new AWS.SQS({ region: 'us-east-1' });

exports.handler = async (event) => {
    const params = {
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/058264511332/cola-prueba', // Reemplaza con tu URL de SQS
        MaxNumberOfMessages: 10, // Número máximo de mensajes a recibir
        WaitTimeSeconds: 20, // Long polling
    };

    try {
        const data = await sqs.receiveMessage(params).promise();
        if (data.Messages) {
            console.log("Mensajes recibidos:", data.Messages);
            // Procesa los mensajes aquí

            // Borra los mensajes después de procesarlos
            for (const message of data.Messages) {
                const deleteParams = {
                    QueueUrl: params.QueueUrl,
                    ReceiptHandle: message.ReceiptHandle
                };
                await sqs.deleteMessage(deleteParams).promise();
                console.log("Mensaje borrado:", message.MessageId);
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ messages: data.Messages }),
            };
        } else {
            console.log("No se recibieron mensajes");
            return {
                statusCode: 200,
                body: JSON.stringify({ messages: [] }),
            };
        }
    } catch (error) {
        console.error("Error recibiendo mensajes:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "No se pudieron recibir los mensajes" }),
        };
    }
};


// {
//     "Version": "2012-10-17",
//     "Statement": [
//         {
//             "Effect": "Allow",
//             "Action": [
//                 "sqs:SendMessage",
//                 "sqs:ReceiveMessage",
//                 "sqs:DeleteMessage",
//                 "sqs:GetQueueAttributes",
//                 "sqs:GetQueueUrl"
//             ],
//             "Resource": "arn:aws:sqs:us-east-1:123456789012:MyQueue"
//         }
//     ]
// }