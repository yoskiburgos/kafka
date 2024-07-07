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
async function connect(){
    const cola1 = "compras";
    const enterprise = "GCP"

    try{
        //Conexion al canal y mensajes
        const conn = await ampq.connect(rabbitSettings);
        console.log("Conexion establecida...");

        const channel = await conn.createChannel();
        console.log("Canal creado...");

        const res = await channel.assertQueue(cola1);
        console.log("Cola creada...");

        //Lectura de mensajes
        console.log('Esperando por mensaje: ' + enterprise);
        channel.consume(cola1, message => {
            let mensaje = JSON.parse(message.content.toString());
            console.log('mensaje Recibido '+mensaje.name);

            if(mensaje.enterprise == enterprise){
                console.log("Se elimina mensaje: "+ enterprise + " ===> "+ JSON.stringify(message));
                //Elimina el mensaje
                channel.ack(message);
 
            }
            // else {
            //     console.log("Este mensaje no es eliminado: "+ JSON.stringify(message));
            // }
        })
    }catch(err){
        console.error('Error -> ' + err);
    }
}