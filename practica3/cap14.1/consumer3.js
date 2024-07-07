const ampq = require("amqplib");

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

//Ejecucion
connect();

//Implememtacion del consumidor
async function connect(){
    const cola1 = "testC";
   // const enterprise = "azure"

    try{
        //Conexion al canal y mensajes
        const conn = await ampq.connect(rabbitSettings);
        console.log("Conexion establecida...");

        const channel = await conn.createChannel();
        console.log("Canal creado...");

        const res = await channel.assertQueue(cola1);
        console.log("Cola creada...");

        //Lectura de mensajes
        //console.log('Esperando por mensaje: ' + enterprise);
        channel.consume(cola1, message => {
            let unidad = JSON.parse(message.content.toString());
            console.log('Mensaje Recibido '+unidad.name);
        })
    }catch(err){
        console.error('Error -> ' + err );
    }
}