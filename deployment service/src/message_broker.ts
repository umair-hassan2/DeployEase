import rabbitmq from "amqplib"

export async function makeConnection(){
    const connection = await rabbitmq.connect("amqp://localhost:5672");
    return connection;
}