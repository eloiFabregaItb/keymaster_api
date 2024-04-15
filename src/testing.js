import db from "./db/db.js";
import { sendEmailRecoverPassword } from "./mailer/emailRecoverPassword.js";
import { sendEmail } from "./mailer/mailer.js";



const [users] = await db.query("SELECT * FROM User")
console.log(users)



// sendEmail("elgrefa@gmail.com")
// sendEmailRecoverPassword("elgrefa@gmail.com","ababdada")


// const response = await db.query(`DELETE FROM User WHERE id NOT IN (1, 29);`)
// console.log(response)


// const response = await db.query(`Update User SET username = "adrian" WHERE id = 29`)
// console.log(response)
