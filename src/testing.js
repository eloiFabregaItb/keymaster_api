import db from "./db/db.js";
import fs from "fs"
import { db_getUserByUsername } from "./db/db_users.js";
import { sendEmailRecoverPassword } from "./mailer/emailRecoverPassword.js";
import { sendEmail } from "./mailer/mailer.js";
import { hashPassword } from "./utils/crypto.js";
import { lorem } from "./assets/lorem.js";
import { shuffle } from "./utils/array.js";



// ------------------------ USERS -------------------------------------

// const [users] = await db.query("SELECT * FROM User")
// console.log(users)

// const [rows] = await db.query(`
// SELECT U.*, 
// CASE WHEN F1.friend_id IS NOT NULL THEN TRUE ELSE FALSE END AS following,
// CASE WHEN F2.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS followed_by
// FROM User U
//   LEFT JOIN Friendship F1 ON U.id = F1.user_id AND F1.friend_id = ?
//   LEFT JOIN Friendship F2 ON U.id = F2.friend_id AND F2.user_id = ?
// `,  [32,32]);
// console.log(rows)


// const user = await db_getUserByUsername("adrian")
// await user.getFriends()
// await user.getNotifications()
// console.log(user.notifications)





// ------------------------ FRIENDSHIPS -------------------------------------

// const [friendships] = await db.query("SELECT * FROM Friendship")
// console.log("FRIENDSHIP",friendships)



// const [friendships] = await db.query(`
// SELECT 
//   (SELECT username FROM User WHERE id = f.user_id) AS user_name,
//   (SELECT username FROM User WHERE id = f.friend_id) AS friend_name
// FROM Friendship f
// `)
// console.log(friendships)









// ------------------------ NOTIFICATIONS -------------------------------------

// const [notifications] = await db.query("SELECT * FROM Notifications")
// console.log("NOTIFICATIONS",notifications)







// ------------------------ EMAIL -------------------------------------

// sendEmail("elgrefa@gmail.com")
// sendEmailRecoverPassword("elgrefa@gmail.com","ababdada")









// ------------------------ SQL -------------------------------------

// const response = await db.query(`DELETE FROM User WHERE id NOT IN (1, 29);`)
// console.log(response)


// const response = await db.query(`Update User SET username = "adrian" WHERE id = 29`)
// console.log(response)



const response = await db.query(`Update Notifications SET seen = 0`)
// console.log(response)




// ------------------------ TEXTS -------------------------------------

// const jsonData = fs.readFileSync("./src/assets/elCrimenYElCastigo.json", "utf8");
// const book = JSON.parse(jsonData);
// shuffle(book)

// const category = "book"
// const language = "ES"
// const author ="Fiódor Dostoyevski"
// const title = "Crimen y castigo"
// for (const text of book) {
//   // console.log(text)
//   await db.query(`INSERT INTO TextStorage (text,length,words,category,language,author,title) VALUES 
//     (?,?,?,?,?,?,?)`,
//     [text,text.length,text.split(" ").length,category,language,author,title]
//   )
// }



//////////// PARSE TEXTS ////////////////

// const filename = "./src/assets/elCrimenYElCastigo.txt"
// const outputFilename = "./src/assets/elCrimenYElCastigo.json";

// fs.readFile(filename, 'utf8', function(err, data) {
//   if (err) throw err;
  
//   const max = 250
//   const min = 80
  

//   const lines = data.split("\n")
//   const result = []
//   let buffer = ""

//   for(let i=0;i<lines.length;i++){
//     const current = lines[i]
    
//     if(current.length > max) continue

//     buffer = current

//     while (i + 1 < lines.length && buffer.length + 1 + lines[i + 1].length <= max) {
//       buffer += " " + lines[i + 1]
//       i++
//     }

//     if (buffer.length >= min && buffer.length <= max) {
//       result.push(buffer);
//     }

//   }

//   // console.log(result.sort((a,b)=>a.length-b.length).map(x=>x.length))
//   // console.log(result)

//   const jsonResult = JSON.stringify(result, null, 2);
//   fs.writeFile(outputFilename, jsonResult, (writeErr) => {
//     if (writeErr) throw writeErr;
//     console.log(`Data written to ${outputFilename}`);
//   });

// })

