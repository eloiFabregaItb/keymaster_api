import db from "./db.js";
import {GameHistory} from "../models/GameHistory.js"
import {User} from "../models/User.js"


export async function db_saveGame(user, textId, time, wpm, errors){

  let total = 0
  const errSimp = {}

  for (const key in errors) {
    const value = errors[key]
    total += value.err
    errSimp[key] = {
      c:value.char,
      e:value.err
    }
    if(value.letter){
      errSimp[key].l = value.letter
    }
  }

  const errorsJson = JSON.stringify(errSimp);

  const [result] = await db.query(`
  INSERT INTO GameHistory (user_id, text_id, time, wpm, errors, totalErrors)
  VALUES (?, ?, ?, ?, ?, ?)
`, [user.id, textId, time, wpm, errorsJson, total]);

}


export async function db_getHistory(user){
  const [rows] = await db.query(`
    SELECT TextStorage.*, GameHistory.*
    FROM GameHistory
    INNER JOIN TextStorage 
    ON GameHistory.text_id = TextStorage.id
    WHERE GameHistory.user_id = ?
    ORDER BY GameHistory.created_at DESC;
    `,[user.id]
  )

  const history = rows.map(x=>new GameHistory(x))


  return history
}


export async function db_getRankingUsers(max = 10){

  //TODO dont untie for error, instead for error% (must do subquery to TextStorage and divide the totalErrors by length)

  const query = `
  WITH RankedGames AS (
    SELECT GameHistory.*,
           ROW_NUMBER() OVER (
               PARTITION BY GameHistory.user_id
               ORDER BY GameHistory.wpm DESC, GameHistory.totalErrors ASC
           ) AS user_rank
    FROM GameHistory
  )
  SELECT
    RankedGames.*,
    User.*,
    TextStorage.*
  FROM RankedGames
  JOIN User
    ON RankedGames.user_id = User.id
  JOIN TextStorage
    ON RankedGames.text_id = TextStorage.id
  WHERE RankedGames.user_rank = 1
  ORDER BY RankedGames.wpm DESC, RankedGames.totalErrors ASC
  LIMIT ?

  `

  const users = []
  const [ranking] = await db.query(query,[max])

  for (const rank of ranking) {
    const u = new User({...rank, id:rank.user_id})
    // let u = users.find(x=>x.id === rank.user_id)
    // if(!u){
    //   u = new User({...rank, id:rank.user_id})
      users.push(u)
    // }
    const r = new GameHistory(rank)
    u.pushHistory(r)
  }

  return users

}





