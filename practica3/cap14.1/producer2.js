const ampq = require("amqplib");

//Configuracion
const rabbitSettings = {
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'admin',
    password: 'admin',
    vhost: '/',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL']
}

//Conexion a rabittmq
connect();

//Implementacion de la conexion
async function connect(){
    const cola1 = "compras";
    const cola2 = "ventas";

    //Lista de mensajes
    const msgs = [
        {"name":"CLOUD 1", "enterprise":"AZURE"},
        {"name":"CLOUD 2", "enterprise":"AWS"},
        {"name":"CLOUD 3", "enterprise":"GCP"}
    ]

    try{
        //Aplica la configuracion
        const conn = await ampq.connect(rabbitSettings);
        console.log("Conexion establecida...");
        //Crea un canal
        const channel = await conn.createChannel();
        console.log("Canal creado...");


        //Agregar una COLA #1
        const res = await channel.assertQueue(cola1);
        console.log("Cola 1 creada...");
        //Convertir a json los mensajes a enviar
        for(let msg in msgs){
            await channel.sendToQueue(cola1, Buffer.from(JSON.stringify(msgs[msg])));
            console.log('Mensaje enviado a la cola ' + cola1)
        }

        //Agregar una COLA #2
        const res2 = await channel.assertQueue(cola2);
        console.log("Cola 2 creada...");

        //Convertir a json los mensajes a enviar
        for(let msg in msgs){
            await channel.sendToQueue(cola2, Buffer.from(JSON.stringify(msgs[msg])));
            console.log('Mensaje enviado a la cola ' + cola2)
        }


    }catch(err){
        console.error('Error -> ' +err);
    }
}