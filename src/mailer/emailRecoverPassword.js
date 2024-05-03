import { EMAIL_CODE_EXPIRATION } from "../constants.js";
import { sendEmail } from "./mailer.js";

export async function sendEmailRecoverPassword(to,code){

  await sendEmail(to,"Código de Verificación - Key Master",`
  <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 10px; padding: 30px;">
      <h1 style="color: #333333; text-align: center;">Key Master</h1>
      <p style="color: #666666; text-align: center; font-size: 16px;">¡Hola!</p>
      <p style="color: #666666; text-align: center; font-size: 16px;">Recibimos una solicitud para restablecer tu contraseña en Key Master. Utiliza el siguiente código de verificación para continuar:</p>
      <div style="text-align: center; padding: 20px; background-color: #43219B; border-radius: 8px;">
        <h2 style="color: #DDDDDD; font-size: 24px; margin: 0;">${code}</h2>
      </div>
      <p style="color: #666666; text-align: center; font-size: 16px;">Este código de verificación caducará en ${EMAIL_CODE_EXPIRATION} minutos. Por favor, no compartas este código con nadie.</p>
      <p style="color: #666666; text-align: center; font-size: 16px;">Si no has solicitado este cambio, puedes ignorar este mensaje.</p>
      <p style="color: #666666; text-align: center; font-size: 16px;">¡Gracias por confiar en Key Master!</p>
    </div>
    <p style="color: #999999; text-align: center; margin-top: 20px; font-size: 14px;">Este mensaje fue enviado automáticamente. Por favor, no respondas a este correo electrónico.</p>
  </div>
`)

}