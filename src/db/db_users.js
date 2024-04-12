import db from "./db.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { CustomError, ERROR } from "../utils/requestManager.js";

const JWT_SECRET = process.env.JWT_SECRET || "secretJWT";

export async function db_getUserByJWT(token) {
  if (!token) return;
  const userData = jwt.verify(token, JWT_SECRET);

  // console.log(userData)

  const { usr_id, iat, exp } = userData
  // console.log(new Date(iat * 1000))
  // console.log(new Date(exp * 1000))
  return await db_getUserByID(usr_id);
}

export async function db_getUserByPassword(usernameOrEmail, password) {
  const [rows, fields] = await db.query(
    "SELECT * FROM User WHERE (username = ? AND password = ?) OR (email = ? AND password = ?)",
    [usernameOrEmail, password,usernameOrEmail,password]
  );

  if (rows && rows[0]) {
    return new User(rows[0]);
  }else{
    throw new CustomError(ERROR.UNEXISTENT)
  }
}

async function db_getUserByID(id) {
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


export async function db_getUserByUsername(usernameOrEmail) {
  if (!usernameOrEmail) return;

  const [rows] = await db.query("SELECT * FROM User WHERE username = ? OR email = ?", [usernameOrEmail,usernameOrEmail]);

  if (rows && rows[0]) {
    return new User(rows[0]);
  }else{
    throw new CustomError(ERROR.UNEXISTENT)
  }
}

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

export async function db_deleteUser(id) {
  const [rows] = await db.query("DELETE FROM Users WHERE id = ?", [id]);
  
  if(rows.affectedRows == 0){
    throw new CustomError(ERROR.UNEXISTENT,"No existe el id")
  }

}




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



// export async function db_getUsersList(minrange = 1){
//   const sql = `SELECT * FROM users WHERE usr_permisos >= ?`

//   const [rows] = await db.query(sql,minrange)

//   return rows.map((row)=>new User(row))
// }