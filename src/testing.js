import db from "./db/db.js";
import { db_getUserByUsername } from "./db/db_users.js";
import { sendEmailRecoverPassword } from "./mailer/emailRecoverPassword.js";
import { sendEmail } from "./mailer/mailer.js";
import { hashPassword } from "./utils/crypto.js";



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
