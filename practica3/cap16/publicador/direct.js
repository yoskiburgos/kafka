
const amqp = require('amqplib')

//  testA,  testB,  testC

//INPUT
const exchangeName = 'ex.direct'
const routingKey =  ''
const exchangeType = 'direct'

//Parametros para replicar los mensajes
const messagesAmount = 10
const wait = 400

//Pausa para enviar los mensajes
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

//Tiempo de espera antes del cierre
async function exitAfterSend() {
    await sleep(messagesAmount * wait * 1.2)

    process.exit(0)
}

////INPUT
//Configuracion  de rabbitmq  con vhost= tipos
const rabbitSettings = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'admin',
    password: 'admin',
    vhost: 'tipos',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
}

//Publicacion del mensaje
async function publicador() {
    //Direcciona la ruta del mensaje
    const connection = await amqp.connect(rabbitSettings)
    const channel = await connection.createChannel()
    await channel.assertExchange(exchangeName, exchangeType)

    //Envio de mensaje 
    sleepLoop(messagesAmount, async () => {
        
        //Genera el mensaje
        const message = {
            id: Math.random().toString(32).slice(2, 6),
            text: 'Mensaje '+exchangeName
        }

        const sent = channel.publish(
            exchangeName,
            routingKey,
            Buffer.from(JSON.stringify(message)),
            {
                // persistent: true
            }
        )

        sent
            ? console.log(`Enviando mensaje a "${exchangeName}" exchange`, message)
            : console.log(
                  `Error al enviar mensaje a "${exchangeName}" exchange`,
                  message
              )
    })
}

publicador().catch((error) => {
    console.error(error)
    process.exit(1)
})

exitAfterSend()
