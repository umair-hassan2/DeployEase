import {S3} from "aws-sdk"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config()

const s3 = new S3({
    accessKeyId: process.env.ACCESS_ID,
    secretAccessKey:process.env.SECRET_ID,
    endpoint:process.env.ENDPOINT
})

export const uploadFile = async(fileName:string , filePath:string)=>{
    try{
    console.log("start uploading...");
    const fileBody = fs.readFileSync(filePath);
    const response = await s3.upload({
        Body: fileBody,
        Bucket:"deployment-ease",
        Key:fileName
    }).promise();

    console.log(response);
    }catch(error){
        console.log(error);
    }
}