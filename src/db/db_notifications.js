


import db from "./db.js";
import { User } from "../models/User.js";
import { CustomError, ERROR } from "../utils/requestManager.js";
import { Notification, NOTIFICATIONS_TYPES } from "../models/Notifications.js";



export async function db_getNotifications(user,onlyUnseen = false){

  const notifications = []
  if(!(user instanceof User)){
    throw new CustomError(ERROR.MISSING_DATA)
  }

  if(!user.isEmailVerified()){
    const n = new Notification({
      userId:user.id,
      type:NOTIFICATIONS_TYPES.EMAIL_NO_VERIFIED,
      warn:true
    })
    await n.init()
    notifications.push(n)
  }

  const sql = onlyUnseen 
    ? `SELECT * FROM Notifications WHERE user_id = ? AND NOT seen`
    : `SELECT * FROM Notifications WHERE user_id = ?`

  const [data] = await db.query(sql,[user.id])

  const notificationsDB = await Promise.all(
    data.map( async x=>{
      const n = new Notification(x)
      await n.init();
      return n
    })
  )
  return [...notifications,...notificationsDB]
}



export async function db_seeNotifications(user,ids){

  console.log("UPDATE",ids,user.id)

  if(!(user instanceof User)){
    throw new CustomError(ERROR.MISSING_DATA)
  }

  const data = await db.query(
    `UPDATE Notifications
    SET seen = TRUE
    WHERE user_id = ? AND notification_id IN (${ids.map(_=>"?").join(", ")});
    `,
    [user.id,...ids]
  )

  return data
}