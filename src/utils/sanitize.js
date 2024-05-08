
import fs from "fs"
import db from "../db/db.js"


const folderPath = './public/usrPic';

export async function sanitizeUsrPic(){

  try {
    const allFiles = await listFiles(folderPath)
    const files = allFiles.filter(x=>x!==".gitkeep")
    // console.log('Files in the directory:', files);

    const [users] = await db.query("SELECT * FROM User WHERE profileImg IS NOT NULL")
    // console.log("USERS",users)
  
  
    const filesWithoutUser = files.filter(file=>!users.some(x=>x.profileImg === file))
  
    // console.log("FILES WITHOUT USER",filesWithoutUser)

    const usersWithoutFile = users.filter(u=>!files.some(x=>x===u.profileImg))

    // console.log("USERS WITHIOUT FILE", usersWithoutFile)

    if(usersWithoutFile.length>0){

      await db.query(`UPDATE User SET profileImg = NULL WHERE id IN (${usersWithoutFile.map(_=>"?").join(", ")})`,[usersWithoutFile.map(x=>x.id)])
    }


    if(filesWithoutUser.length > 0){
      filesWithoutUser.forEach(file => {
        fs.unlinkSync(`${folderPath}/${file}`);
        console.log(`Deleted file: ${file}`);
      });
    }

  } catch (err) {
    console.error('Error reading directory:', err);
  }
  
  
}







function listFiles(folderPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(files)
    });
  });
}