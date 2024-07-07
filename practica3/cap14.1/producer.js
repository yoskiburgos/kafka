const ampq = require("amqplib");

//INPUT
//Configuracion
const rabbitSettings = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'admin',
    password: 'admin',
    vhost: 'colas',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
}

//Conexion a rabittmq
connect();

//Implementacion de la conexion
async function connect(){

    //INPUT
    const cola1 = "testA";

    //Lista de mensajes
    const msgs = [
        {"name":"Nube 1", "enterprise":"azure"},
        {"name":"Nube 2", "enterprise":"aws"},
        {"name":"Nube 3", "enterprise":"gcp"}
    ]

    try{
        //Aplica la configuracion
        const conn = await ampq.connect(rabbitSettings);
        console.log("Conexion establecida...");

        //Crea un canal
        const channel = await conn.createChannel();
        console.log("Canal creado...");

        //Agregar una cola al canal
        const res = await channel.assertQueue(cola1);
        console.log("Cola creada...");

        //Convertir a json los mensajes a enviar
        for(let msg in msgs){
            await channel.sendToQueue(cola1, Buffer.from(JSON.stringify(msgs[msg])));
            console.log('Mensaje enviado a la cola ' + cola1)
        }

    }catch(err){
        console.error('Error -> '+err);
    }
}