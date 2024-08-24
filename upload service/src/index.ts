import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import simpleGit from "simple-git";
import path from "path"
import delay, { generateMessage, getAllDirFiles, randomIdGenerator } from "./helpers";
import { uploadFile } from "./objectStore";
import { connectTOMessageBroker, sendMessage } from "./messageBroker";

const app = express();
dotenv.config();
console.log(process.env.PORT);
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cors())

app.get("/" , (req , res)=>{
    res.json({"message" :`server is running on PORT = ${PORT}`});
});


app.post('/upload' , async (req , res) => {
    try{
        const projectUrl = req.body.projectUrl;
        console.log(projectUrl);

        const randomId = randomIdGenerator(15);
        await simpleGit().clone(projectUrl , path.join(__dirname,`projects/${randomId}`));

        const allFiles = getAllDirFiles(path.join(__dirname,`projects/${randomId}`));
        
        // upload each file to object store
        allFiles.forEach(file=>{
            console.log(file)
            uploadFile(file.slice(__dirname.length + 1),file)
        })

        const connection = await connectTOMessageBroker();

        // add dummy delay without blocking server
        await delay(2000);
        if(connection){
            sendMessage(`${randomId}` , connection);
        }else{
            console.log("Rabbit MQ connection failed");
        }
        res.json(generateMessage("uploaded sucessfuly" , [randomId]));
        
    }catch(error){
        console.log(`ERROR : ${error}`);
        res.status(500).json(generateMessage("server error"));
    }
});

app.listen(PORT , ()=>{
    console.log(`Server is running on PORT = ${PORT}`);
})