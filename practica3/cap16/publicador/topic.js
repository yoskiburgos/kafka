
const amqp = require('amqplib')

//Input
const exchangeName =  'test.topic'
const routingKey =  'test.rabbitmq.*'
const exchangeType = 'topic'

//Nro de mensajes a enviar
const messagesAmount = 2
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

//Configuracion  vhost= tipos
const rabbitSettings = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'admin',
    password: 'admin',
    vhost: 'tipos',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
}

//Publicador
async function publisher() {
    const connection = await amqp.connect(rabbitSettings)
    const channel = await connection.createChannel()

    //Direccionar el tipo de exchange
    await channel.assertExchange(exchangeName, exchangeType)

    sleepLoop(messagesAmount, async () => {
        const message = {
            id: Math.random().toString(32).slice(2, 6),
            text: 'Hola RabbitTopic'
        }

        const sent = channel.publish(
            exchangeName,
            routingKey,
            Buffer.from(JSON.stringify(message)),
            {
                //persistent: true
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
