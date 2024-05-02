import db from "./db.js";



export async function db_getTexts(count = 50, language = undefined, category = undefined){

  let query = "SELECT * FROM TextStorage"
  const queryParams = []
  const queryValues = []

  if (language) {
    queryParams.push("language = ?")
    queryValues.push(language);
  }

  if (category) {
    queryParams.push("category = ?")
    queryValues.push(category);
  }

  if (queryParams.length > 0) {
    query += ` WHERE ${queryParams.join(" AND ")}`
  }

  query += " ORDER BY RAND() LIMIT ?"

  const [rows] = await db.query(query, [...queryValues, count])
  return rows
}