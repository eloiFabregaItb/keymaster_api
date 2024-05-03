import { BACKEND_URL, EMAIL_CODE_EXPIRATION } from "../constants.js";
import { sendEmail } from "./mailer.js";

export async function sendEmailVerifyEmail(to,code){
  
  const link = `${BACKEND_URL}/auth/validate?code=${code}&email=${to.toLowerCase()}`

  console.log(link)

  await sendEmail(to, "¡Bienvenido a Key Master!", `
    <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 10px; padding: 30px;">
        <h1 style="color: #333333; text-align: center;">¡Bienvenido a Key Master!</h1>
        <p style="color: #666666; text-align: center; font-size: 16px;">¡Hola!</p>
        <p style="color: #666666; text-align: center; font-size: 16px;">¡Gracias por unirte a Key Master! Estamos emocionados de tenerte como parte de nuestra comunidad.</p>
        <p style="color: #666666; text-align: center; font-size: 16px;">Para comenzar, por favor verifica tu dirección de correo electrónico haciendo clic en el siguiente enlace:</p>
        <div style="text-align: center;">
          <a href="${link}" style="background-color: #43219B; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 18px;">Verificar Correo Electrónico</a>
        </div>
        
        <p style="color: #666666; text-align: center; font-size: 16px;">Este enlace expirará en ${EMAIL_CODE_EXPIRATION} minutos. Por favor, asegúrate de verificar tu correo electrónico dentro de este período.</p>
        <p style="color: #666666; text-align: center; font-size: 16px;">Una vez verificado, podrás disfrutar de todas las características y beneficios que ofrece Key Master.</p>
        <p style="color: #666666; text-align: center; font-size: 16px;">¡Bienvenido de nuevo y gracias por confiar en Key Master!</p>

        <p style="font-size: 13px; text-align: center; font-size: 16px; margin-top: 1rem;">
          <span style="color: #666666;">Si el botón no funciona, prueba este enlace:</span>
          <br/>
          <a style="color:ADD8E6" href="${link}">${link}</a>
        </p>
      </div>
      <p style="color: #999999; text-align: center; margin-top: 20px; font-size: 14px;">Este mensaje fue enviado automáticamente. Por favor, no respondas a este correo electrónico.</p>
    </div>
  `);


}