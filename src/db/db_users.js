import fs from "fs"
import path from "path";
import db from "./db.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { CustomError, ERROR } from "../utils/requestManager.js";
import { levenshteinDistance } from "../utils/levenstheinDistance.js";

const JWT_SECRET = process.env.JWT_SECRET || "secretJWT";



//*------------------- JWT --------------------------------

export function unzipJWT(token){
  if (!token) return;
  const userData = jwt.verify(token, JWT_SECRET);
  return userData
}

export async function db_getUserByJWT(token) {
  if (!token) return;

  const { usr_id, iat, exp } = unzipJWT(token)
  // console.log(new Date(iat * 1000))
  // console.log(new Date(exp * 1000))
  return await db_getUserByID(usr_id);
}






//*------------------- LOGIN --------------------------------
//given a username and password return a user if matches
export async function db_getUserByPassword(usernameOrEmail, password) {
  const [rows, fields] = await db.query(
    "SELECT * FROM User WHERE (username = ? AND password = ?) OR (email = ? AND password = ?)",
    [usernameOrEmail, password,usernameOrEmail,password]
  );

  if (rows && rows[0]) {
    const u = new User(rows[0]);
    
    if(!u.comparePswd(password)){
      throw new CustomError(ERROR.UNEXISTENT)
    }
    return u
  }else{
    throw new CustomError(ERROR.UNEXISTENT)
  }
}





// ------------------------------------------- ID --------------------------
//return the user by a given id
export async function db_getUserByID(id) {
  if (!id) return;

  try {
    const [rows] = await db.query("SELECT * FROM User WHERE id = ?", [id]);

    if (rows && rows[0]) {
      return new User(rows[0]);
    }else{
      throw new CustomError(ERROR.UNEXISTENT)
    }
  } catch (err) {
    console.error(err);
  }
}








//--------------------------------------------- USERNAME --------------------------------
//given a username or email, return the user
//findOne
export async function db_getUserByUsername(usernameOrEmail,onlyEmail = false) {
  if (!usernameOrEmail) return;

  const [rows] = onlyEmail 
    ? await db.query("SELECT * FROM User WHERE email = ?", [usernameOrEmail])
    : await db.query("SELECT * FROM User WHERE username = ? OR email = ?", [usernameOrEmail,usernameOrEmail])

  if (rows && rows[0]) {
    return new User(rows[0]);
  }else{
    throw new CustomError(ERROR.UNEXISTENT, "User not found")  

  }
}


// ---------------------------------------------- SEARCH USERS ----------------------
//given email or username return an array of objects
export async function db_searchUsers(searchQuery) {
  if (!searchQuery) return [];

  // const searchParam = `%${searchQuery}%`;
  // const [rows] = await db.query("SELECT * FROM User WHERE username LIKE ? OR email LIKE ? LIMIT 10", [searchParam, searchParam]);

  // const users = rows.map(row => new User(row));
  // return users;

  // const [rows] = await db.query("SELECT * FROM User");

  const [rows] = await db.query(`
  SELECT U.*, 
    CASE WHEN F1.friend_id IS NOT NULL THEN TRUE ELSE FALSE END AS following,
    CASE WHEN F2.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS followed_by
  FROM User U
  LEFT JOIN Friendship F1 ON U.id = F1.user_id AND F1.friend_id = ?
  LEFT JOIN Friendship F2 ON U.id = F2.friend_id AND F2.user_id = ?
`,  [32,32]);


  const users = [];
  const limit = 10;
  
  for (let i = 0; i < rows.length && users.length < limit; i++) {
    const distance = levenshteinDistance(searchQuery, rows[i].username);
    if (distance <= 2) {
      users.push(new User(rows[i]));
    }
  }

  return users;


}



// ----------------------------------- SIGNUP NEW USER -------------------------------------
export async function db_createUser(username, email, password, returnUser=false) {
  const data = await db.query(
    "INSERT INTO User (password,email,username) VALUES (?,?,?)",
    [password,email,username]
  );
 
  if (returnUser) {
    const [insertedUser] = await db.query("SELECT * FROM User WHERE username = ?", [username]);
    return new User(insertedUser[0])
  }else {
    return data
  }
}



// ------------------------------------ DELETE USER -----------------------------
export async function db_deleteUser(id) {
  console.log("DELETE USER id",id)

  try{

    const [rows] = await db.query("DELETE FROM User WHERE id = ?", [id]);
    
    if(rows.affectedRows == 0){
      throw new CustomError(ERROR.UNEXISTENT,"No existe el id")
    }
  }catch(err){
    console.log(err)
  }

}



// ------------------------------------- USER UPDATE -----------------------------------

export async function db_updateUserPassword(user,newPassword){
  const sql = `UPDATE User SET password = ? WHERE id = ?`
  const [data] = await db.query(sql,[newPassword,user.id])
  return data
}

export async function db_updateUserEmailValidated(user){
  const sql = `UPDATE User SET emailVerified = 1 WHERE id = ?`
  const [data] = await db.query(sql,[user.id])
  return data
}



export async function db_updateUserImg(user, newImg){
  
  if(user.profileImg){
    const folderPath = './public/usrPic/';
    deleteFileIfExists(folderPath,user.profileImg)
  }


  const sql = `UPDATE User SET profileImg = ? WHERE id = ?`
  const [data] = await db.query(sql,[newImg, user.id])
  return data
}





// export async function db_getUsersList(minrange = 1){
//   const sql = `SELECT * FROM users WHERE usr_permisos >= ?`

//   const [rows] = await db.query(sql,minrange)

//   return rows.map((row)=>new User(row))
// }


/**
 * 
 * @param {User} user Objeto Usuario
 * @param {string[]} fields Array de strings que definen los campos a actualizar
 */
// export async function db_updateUserFields(user,fields){

//   const allFields = {
//     username:user.username,
//     password:user.password,
//     profileImg:user.profileImg,
//   }

//   const syntax = `UPDATE User SET 
//   ${fields.map(x=>allFields[x] ? x + " = ? ":"").join(",")}
//   WHERE usr_id = ?`
  
//   const values = fields.flatMap(x=>allFields[x]?allFields[x]:[])
//   values.push(user.id)
//   // console.log(syntax,values)
  
//   const [rows] = await db.query(syntax,values)

//   if(rows.affectedRows == 0){
//     throw new CustomError(ERROR.UNEXISTENT,"No existe el id")
//   } 
// }
function deleteFileIfExists(folderPath, fileName) {
  const filePath = path.join(folderPath, fileName);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File does not exist:', err);
      return;
    }

    // File exists, so delete it
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return;
      }
      console.log('File deleted successfully:', fileName);
    });
  });
}

