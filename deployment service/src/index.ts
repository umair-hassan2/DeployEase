import rabbitmq from "amqplib"
import { makeConnection } from "./message_broker";
import { downloadFiles } from "./object_store";

async function main(){
    // const connection = await makeConnection();
    // const channel = await connection.createChannel();
    // await channel.assertQueue("pending projects");
    // console.log("now start pulling ");
    // while(true){
    //     await channel.consume("pending projects" , (message)=>{
    //         console.log(message?.content.toString());
    //     })
    // }
    console.log("start pulling");
    await downloadFiles("projects/14aho1azbc5h951");
    console.log("ends");
}

main();