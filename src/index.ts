import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import simpleGit from "simple-git";
import path from "path"
import { generateMessage, getAllDirFiles, randomIdGenerator } from "./helpers";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cors())

app.get("/" , (req , res)=>{
    res.json({"message" :"server is running"})
});


app.post('/upload' , async (req , res) => {
    try{
        const projectUrl = req.body.projectUrl;
        console.log(projectUrl);

        const randomId = randomIdGenerator(15);
        await simpleGit().clone(projectUrl , path.join(__dirname,`projects/${randomId}`));

        res.json(generateMessage("cloned sucessfuly" , [randomId]));
        
    }catch(error){
        console.log(`ERROR : ${error}`);
        res.status(500).json(generateMessage("server error"));
    }
});

app.listen(3000 , ()=>{
    console.log("Server is running on port 3000");
})