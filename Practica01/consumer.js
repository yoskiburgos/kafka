const { Kafka } = require("kafkajs");

class Consumer {
    constructor() {
        const kafka = new Kafka({
            clientId: "app1",
            brokers: ["localhost:9092"],
        });
        this.consumer = kafka.consumer({ groupId: "test-group" });
    }

    async consume() {
        console.log("Recuperando data!");
        await this.consumer.connect();
        await this.consumer.subscribe({
            topic: "test",
            fromBeginning: true,
        });
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log(message.value.toString());
            },
        });
    }
}

let consumer = new Consumer();
consumer.consume();