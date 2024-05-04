import db from "./db.js";
import { User } from "../models/User.js";
import { CustomError, ERROR } from "../utils/requestManager.js";
import { NOTIFICATIONS_TYPES } from "../models/Notifications.js"



export async function db_follow(user, friend){

  if(!(user instanceof User) || !(friend instanceof User)){
    throw new CustomError(ERROR.MISSING_DATA)
  }


  const data = await db.query(
    `INSERT INTO Friendship (user_id, friend_id) VALUES (?, ?);`,
    [user.id, friend.id]
  )


  await db.query(
    `INSERT INTO Notifications (user_id, type, target) VALUES (?, ?, ?);`,
    [friend.id, NOTIFICATIONS_TYPES.FOLLOW, user.id]
  );


  return data
}


export async function db_unfollow(user, friend) {
  if (!(user instanceof User) || !(friend instanceof User)) {
    throw new CustomError(ERROR.MISSING_DATA);
  }

  const data = await db.query(
    `DELETE FROM Friendship WHERE user_id = ? AND friend_id = ?;`,
    [user.id, friend.id]
  );


  await db.query(
    `DELETE FROM Notifications WHERE user_id = ? AND type = ? AND target = ?;`,
    [friend.id, NOTIFICATIONS_TYPES.FOLLOW, user.id]
  );



  return data;
}

export async function db_getFriends(user){
  const [data] = await db.query(
    `SELECT U.*, 
      CASE WHEN F1.friend_id IS NOT NULL THEN TRUE ELSE FALSE END AS following,
      CASE WHEN F2.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS followed_by
    FROM User U
    LEFT JOIN Friendship F1 ON U.id = F1.user_id AND F1.friend_id = ?
    LEFT JOIN Friendship F2 ON U.id = F2.friend_id AND F2.user_id = ?
    WHERE U.id IN (
        SELECT friend_id
        FROM Friendship
        WHERE user_id = ?
    );`,
    [user.id, user.id, user.id]
  );

  const users = data.map(x => new User(x));

  return users;
}

export async function db_getFollowers(user){
  const [data] = await db.query(
    `SELECT U.*, 
      CASE WHEN F1.friend_id IS NOT NULL THEN TRUE ELSE FALSE END AS following,
      CASE WHEN F2.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS followed_by
    FROM User U
    LEFT JOIN Friendship F1 ON U.id = F1.user_id AND F1.friend_id = ?
    LEFT JOIN Friendship F2 ON U.id = F2.friend_id AND F2.user_id = ?
    WHERE U.id IN (
        SELECT user_id
        FROM Friendship
        WHERE friend_id = ?
    );`,
    [user.id, user.id, user.id]
  );

  const users = data.map(x => new User(x));

  return users;
}

// export async function db_getFriends(user){
//   const [data] = await db.query(
//     `SELECT *
//     FROM User
//     WHERE id IN (
//         SELECT friend_id
//         FROM Friendship
//         WHERE user_id = ?
//     );`,
//     [user.id]
//   );

//   const users = data.map(x=>new User(x))

//   return users


// }



// export async function db_getFollowers(user){
//   const [data] = await db.query(
//     `SELECT *
//     FROM User
//     WHERE id IN (
//         SELECT user_id
//         FROM Friendship
//         WHERE friend_id = ?
//     );`,
//     [user.id]
//   );

//   const users = data.map(x=>new User(x))

//   return users


// }