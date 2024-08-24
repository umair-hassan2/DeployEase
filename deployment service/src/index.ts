import rabbitmq from "amqplib"
import { makeConnection } from "./message_broker";
import { downloadFiles } from "./object_store";
import dotenv from "dotenv"
import path from "path"
import buildProject from "./project_handler";
dotenv.config();



async function main(){
    const connection = await makeConnection();
    const channel = await connection.createChannel();
    await channel.assertQueue("pending projects");
    console.log("now start pulling ");
    let test = 3;
    while(true){
        await channel.consume("pending projects" , async (message)=>{
            
            // wait for cloudflare files to be available
            //await delay(2 * 1000);

            let projectId:string | undefined = message?.content.toString();
            console.log("New project detected");
            console.log("So let's pull it from AWS Server");
            console.log(projectId);
            if(projectId !== undefined){
                console.log('project id is ' + projectId);
                await downloadFiles(`projects/${projectId}`);

                let OK = await buildProject(projectId);
            }

            if(message)
                channel.ack(message);
        });
    }

    
}

// just for testing and dev purposes... will clean it later
async function testBuilds(){
    let projectId = "5f093efo4owg4fk";
    let OK = await buildProject(projectId);
    if(OK)
        console.log("done it");
    else 
        console.log("Some error occured");
}

main();