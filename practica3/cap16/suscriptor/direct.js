
const amqp = require('amqplib')
const queue =  'hola'
const exchangeName =  'test-direct'
const exchangeType = 'direct'
const pattern =  ''

console.log({
    queue,
    exchangeName,
    pattern
})

function intensiveOperation() {
    let i = 1e3
    while (i--) {}
}

const rabbitSettings = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'admin',
    password: 'admin',
    vhost: 'colas',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
}

async function subscriber() {
    const connection = await amqp.connect(rabbitSettings)
    const channel = await connection.createChannel()

    await channel.assertQueue(queue)

    await channel.assertExchange(exchangeName, exchangeType)

    await channel.bindQueue(queue, exchangeName, pattern)

    channel.consume(queue, (message) => {
        const content = JSON.parse(message.content.toString())

        intensiveOperation()

        console.log(`Recibiendo mensaje desde "${queue}" cola`)
        console.log(content)

        channel.ack(message)
    })
}

subscriber().catch((error) => {
    console.error(error)
    process.exit(1)
})
