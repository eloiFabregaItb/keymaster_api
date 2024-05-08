export class GameHistory{
  constructor({
    id,
    text_id,
    time,
    wpm,
    errors,
    created_at,
    totalErrors,

    //optionaly has text
    text,
    length,
    words,
    category,
    language,
    author,
    title
  }){
    this.id = id
    this.textId = text_id
    this.time = time
    this.wpm = wpm
    this.errors = this.parseErrors(errors)

    this.createdAt = created_at
    this.totalErrors = totalErrors

    this.text=text
    this.length = length
    this.words = words
    this.category = category
    this.language = language
    this.author = author
    this.title = title
  }


  parseErrors(errors){
    const obj = JSON.parse(errors)

    const result = {}
    for (const key in obj) {
      const value = obj[key]

      result[key] = {
        char:value.c,
        err:value.e
      }
      if(value.l){
        result[key].letter = value.l
      }
    }

    return result
  }
}