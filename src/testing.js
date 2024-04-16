import db from "./db/db.js";
import { db_getUserByUsername } from "./db/db_users.js";
import { sendEmailRecoverPassword } from "./mailer/emailRecoverPassword.js";
import { sendEmail } from "./mailer/mailer.js";




// ------------------------ USERS -------------------------------------

// const [users] = await db.query("SELECT * FROM User")
// console.log(users)



// const user = await db_getUserByUsername("adrian")
// await user.getFriends()
// await user.getNotifications()
// console.log(user.notifications)




// ------------------------ FRIENDSHIPS -------------------------------------

// const [friendships] = await db.query("SELECT * FROM Friendship")
// console.log(friendships)



// const [friendships] = await db.query(`
// SELECT 
//   (SELECT username FROM User WHERE id = f.user_id) AS user_name,
//   (SELECT username FROM User WHERE id = f.friend_id) AS friend_name
// FROM Friendship f
// `)
// console.log(friendships)









// ------------------------ NOTIFICATIONS -------------------------------------

// const [notifications] = await db.query("SELECT * FROM Notifications")
// console.log(notifications)







// ------------------------ EMAIL -------------------------------------

// sendEmail("elgrefa@gmail.com")
// sendEmailRecoverPassword("elgrefa@gmail.com","ababdada")









// ------------------------ SQL -------------------------------------

// const response = await db.query(`DELETE FROM User WHERE id NOT IN (1, 29);`)
// console.log(response)


// const response = await db.query(`Update User SET username = "adrian" WHERE id = 29`)
// console.log(response)
