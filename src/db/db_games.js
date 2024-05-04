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


export async function db_getRanking(max = 10){

  //TODO dont untie for error, instead for error% (must do subquery to TextStorage and divide the totalErrors by length)

  const query = `
  WITH TopUsers AS (
    SELECT user_id, MAX(wpm) AS max_wpm, MIN(JSON_LENGTH(errors)) AS min_errors
    FROM GameHistory
    GROUP BY user_id
    ORDER BY max_wpm DESC, min_errors ASC
    LIMIT ?
  )
  
  SELECT  User.*, GameHistory.*
  FROM GameHistory
  INNER JOIN TopUsers ON GameHistory.user_id = TopUsers.user_id
  INNER JOIN User ON GameHistory.user_id = User.id
  ORDER BY TopUsers.max_wpm DESC, TopUsers.min_errors ASC, GameHistory.created_at DESC;
  `

  const users = []
  const [ranking] = await db.query(query,[max])

  console.log(ranking)

  for (const rank of ranking) {
    let u = users.find(x=>x.id === rank.user_id)
    if(!u){
      u = new User({...rank, id:rank.user_id})
      users.push(u)
    }
    const r = new GameHistory(rank)
    u.pushHistory(r)
  }

  console.log(users)

}



