'use strict'

const amqp = require('amqplib')
const exchangeName = 'test.fanout'
const exchangeType = 'fanout'

//Replicas
const messagesAmount = 3
const wait = 400

//Espera
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

async function sleepLoop(number, cb) {
    while (number--) {
        await sleep(wait)

        cb()
    }
}

async function exitAfterSend() {
    await sleep(messagesAmount * wait * 1.2)

    process.exit(0)
}

//Configuracion
const rabbitSettings = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'admin',
    password: 'admin',
    vhost: 'tipos',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
}

//Publicacion
async function publisher() {
    const connection = await amqp.connect(rabbitSettings)
    const channel = await connection.createChannel()

    await channel.assertExchange(exchangeName, exchangeType)

    sleepLoop(messagesAmount, async () => {
        const message = {
            id: Math.random().toString(32).slice(2, 6),
            text: 'Hola rabbitFanout'
        }

        const sent = await channel.publish(
            exchangeName,
            '',
            Buffer.from(JSON.stringify(message)),
            {
                persistent: true
            }
        )

        sent
            ? console.log(`Enviando "${exchangeName}" exchange`, message)
            : console.log(
                  `Error "${exchangeName}" exchange`,
                  message
              )
    })
}

publisher().catch((error) => {
    console.error(error)
    process.exit(1)
})

exitAfterSend()
