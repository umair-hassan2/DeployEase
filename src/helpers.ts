import fs from "fs"
import path from "path"

export function randomIdGenerator(MAX_LEN = 6) {
  const base = "0123456789qwertyuiopasdfghjklzxcvbnm";
  let ans = "";

  for(let i = 0;i < MAX_LEN;i++){
    ans += base[Math.floor(Math.random() * base.length)];
  }

  return ans;
}

export const getAllDirFiles = (absolutePath: string) => {
  let ans: string[] = [];

  const currentFiles = fs.readdirSync(absolutePath);
  currentFiles.forEach(file =>{
      const fullPath = path.join(absolutePath, file);
      
      // if full path is directory then recursively determine the path to files
      // inside that directory
      if(fs.statSync(fullPath).isDirectory()){
        ans = ans.concat(getAllDirFiles(fullPath));
      }else{

        // fixPath is used only to fix path delimeter on windows
        ans.push(fixPath(fullPath));
      }
  })

  return ans;
}

export const fixPath = (filePath:string)=>{
  let newPath = "";

  for(let i = 0;i < filePath.length;i++){
    if(filePath[i] === path.sep && path.sep === '\\'){
      newPath += '/';
    }else{
      newPath += filePath[i];
    }
  }

  return newPath;
}

export function generateMessage(message: string , payload:any[] = []){
  return {
    "message" : message,
    "payload" : payload
  }
}