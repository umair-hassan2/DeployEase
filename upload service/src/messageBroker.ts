import rabbitmq from "amqplib"
import dotenv from "dotenv"

dotenv.config();
let brokerUrl = process.env.MESSAGE_BROKER_URL || "amqp://localhost:5672"
/*
local url -> ""
*/
export const connectTOMessageBroker = async ()=>{
    console.log("starting broker connection...!");
    try{
        const connection = await rabbitmq.connect(brokerUrl);
        return connection;
    }catch(error){
        console.log(error);
    }
    return null;
}

export const sendMessage = async (message : string,connection : rabbitmq.Connection)=>{
    const channel = await connection.createChannel();
    const result = await channel.assertQueue("pending projects" , {durable:true});
    channel.sendToQueue("pending projects",Buffer.from(message));
    console.log(`message sent = ${message}`);
}
