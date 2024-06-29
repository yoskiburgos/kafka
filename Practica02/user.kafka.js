//##########  2
const { findSchemaBySubjectAndVersion, sendMessageToTopic, readMessageFromTopic } = require('./kafka')

const topic = 'info-users'
const version = 1
const subject = 'info-users-value'  //Esquema

//Metodo de ESCRITURA del mensaje
const writeUserDataToKafka = async (payload) => {
  try {
    //Busqueda del esquema
    const encodePayloadId = await findSchemaBySubjectAndVersion({ version, subject })

    //Pintado de log
    console.log(`Topic: ${topic}; subject: ${subject}; id: ${encodePayloadId}`)

    //Envio asincrono de mensaje
    await sendMessageToTopic({ payload, topic, encodePayloadId })  //mensaje,  nombre_topico,  esquema

  } catch (err) {
    console.error(err)
  }
}

//Metodo de LECTURA de mensajes
const readMessages = () => {
  readMessageFromTopic(topic, (data) => {
    console.log(data, 'data desde kafka')
  })
}

//Exportar los metodos
module.exports.writeUserDataToKafka = writeUserDataToKafka
module.exports.readMessages = readMessages