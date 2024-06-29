//##########  3
const express = require('express')
const { writeUserDataToKafka, readMessages } = require('./user.kafka')

const app = express()
const port = 3000

//Lectura de mensajes
readMessages()

//Metodo get de envio
app.get('/enviar', async (req, res) => {
  await writeUserDataToKafka({ email: 'micorreo@mail.com', isNew: true, message: 'Siguiente correo' })

  res.send('Prueba de envio')
})

app.listen(port, () => {
  console.log(`Escuchando en  http://localhost:${port}`)
})