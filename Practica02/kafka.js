//##########  1
const { Kafka } = require('kafkajs')
const { SchemaRegistry } = require('@kafkajs/confluent-schema-registry')

//autenticacion - opcional
const username = ''
const password = ''
//Datos de entrada
const brokers = ['localhost:9092']
const host = 'http://localhost:8081'
const clientId = 'client-id-1'
const groupId = 'grupo1'

//Autenticacion desestimada
const sasl = username && password ? { username, password, mechanism: 'plain' } : null
const ssl = !!sasl
const registry = new SchemaRegistry({ host })
const kafka = new Kafka({ clientId, brokers /*ssl sasl*/ })

//Extender de kafka el prod y cons
const producer = kafka.producer()
const consumer = kafka.consumer({ groupId })

//Recuperar esquema
const findSchemaBySubjectAndVersion = ({ version, subject }) => registry.getRegistryId(subject, version)

//Enviar mensaje
const sendMessageToTopic = async ({ key, topic, encodePayloadId, payload }) => {
  try {
   await producer.connect()
   const encodedPayload = await registry.encode(encodePayloadId, payload)

   //Envio
   const responses = await producer.send({
     topic: topic,
     messages: [{ key, value: encodedPayload }]
   })

   console.info('Envio Exitoso a Kafka', responses)
  } catch (err) {
    console.error('Error al intentar enviar a Kafka', err)
  }
}

//Leer mensaje
const readMessageFromTopic = async (topic, func) => {
  await consumer.connect()
  await consumer.subscribe({ topic })
  await consumer.run({
    //recorrido de la lista de mensajes
    eachMessage: async ({ message }) => {
      try {
        const decodedMessage = {
          ...message,
          // key: await registry.decode(message.key),
          value: await registry.decode(message.value)
        }

        func(decodedMessage)
      } catch (err) {
        console.error(err)
      }
    },
  })
}

//Exportar metodos
module.exports.findSchemaBySubjectAndVersion = findSchemaBySubjectAndVersion
module.exports.sendMessageToTopic = sendMessageToTopic
module.exports.readMessageFromTopic = readMessageFromTopic