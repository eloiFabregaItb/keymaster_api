export class GameHistory{
  constructor({
    id,
    text_id,
    time,
    wpm,
    errors,
    created_at,
    totalErrors
  }){
    this.id = id
    this.textId = text_id
    this.time = time
    this.wpm = wpm
    this.errors = JSON.parse(errors)
    this.createdAt = created_at
    this.totalErrors = totalErrors
  }
}