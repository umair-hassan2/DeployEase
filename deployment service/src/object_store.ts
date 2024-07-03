import {S3} from "aws-sdk"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"
dotenv.config();

const s3 = new S3({
    accessKeyId:process.env.ACCESS_ID,
    secretAccessKey:process.env.SECRET_ID,
    endpoint:process.env.ENDPOINT
});

export const downloadFiles = async(folderPath:string)=>{
    const allFiles = await s3.listObjectsV2({
        Bucket:"deployment-ease",
        Prefix:folderPath
    }).promise();

    console.log("see to it please");
    const allPromises = allFiles.Contents?.map(async({Key})=>{
        return new Promise((resolve)=>{
            if(!Key){
                resolve("");
                return;
            }

            const fullPath = path.join(__dirname , Key);
            const fileDestination = fs.createWriteStream(fullPath);
            const dirName = path.dirname(fullPath);

            if(!fs.existsSync(dirName)){
                fs.mkdirSync(dirName , {recursive:true});
            }

            s3.getObject({
                Bucket:"deployment-ease",
                Key
            }).createReadStream().pipe(fileDestination).on("finish" , ()=>{
                console.log("downloaded");
                resolve("");
            })
        })
    }) || [];

    await Promise.all(allPromises?.filter(x => x !== undefined));
}
