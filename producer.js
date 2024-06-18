const { Kafka } = require("kafkajs");

class Producer {
    constructor() {
        const kafka = new Kafka({
            clientId: "app1",
            brokers: ["localhost:9092"],
        });
        this.producer = kafka.producer();
    }

    async produce(message) {
        console.log("Enviando data!");
        await this.producer.connect();
        await this.producer.send({
            topic: "test",
            messages: [{ value: message }],
        });
        await this.producer.disconnect();
    }
}

let producer = new Producer();

producer.produce("Mensaje!");
producer.produce(JSON.stringify(15));
producer.produce(JSON.stringify({
    a: [10, 28],
    b: "Otro mensaje!"
}));