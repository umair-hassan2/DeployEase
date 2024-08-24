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
        Bucket:process.env.BUCKET_NAME as string,
        Prefix:folderPath
    }).promise();

    if(allFiles.Contents === undefined){
        return;
    }

    console.log("control here with total files as " + allFiles.Contents.length);
    console.log(allFiles.IsTruncated);

    let totalFiles = allFiles.Contents?.length;
    let loadedFiles = 0;

    // now load the content of all those remote files
    // and create a replica directory on local server
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
                Bucket:process.env.BUCKET_NAME as string,
                Key
            }).createReadStream().pipe(fileDestination).on("finish" , ()=>{
                loadedFiles++;
                let percent = (loadedFiles / totalFiles) * 100;
                console.log(`${percent} % download completed`);
                console.log();
                resolve("");
            })
        })
    }) || [];

    await Promise.all(allPromises?.filter(x => x !== undefined));
}
