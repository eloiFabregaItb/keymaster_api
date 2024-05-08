



export function isEmailValid(email){
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email)
}






const SPECIAL_CHARACTERS = "!@#$%^&*()_-+={}[]|:;\"<>,.?/~\\`"
const MIN_LENGTH = 6

export function validatePassword(password="") {

  const errors = {};
  const err_mandatory = []

  const hasMinimumLength = password.length>=MIN_LENGTH
  const hasLowercase = /[a-z]/.test(password)
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialCharacter = password.split("").some(x => SPECIAL_CHARACTERS.includes(x))


  // Minimum 8 characters
  if (!hasMinimumLength) {
    errors[`MIN_LENGTH`] = MIN_LENGTH
  }

  // At least one lowercase letter
  if (!hasLowercase) {
    err_mandatory.push("LOWERCASE")
  }

  // At least one uppercase letter
  // or
  // At least one number
  // or
  // At least one symbol
  if (!hasUppercase && !hasNumber && !hasSpecialCharacter) {
    err_mandatory.push(["UPPERCASE", "NUMBER", "SYMBOL"])
  }

  if(err_mandatory.length>0){
    errors.MANDATORY = err_mandatory
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
