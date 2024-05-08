import { BACKEND_URL, EMAIL_CODE_EXPIRATION } from "../constants.js";
import { sendEmail } from "./mailer.js";

export async function sendEmailDeleteAccountConfirmation(to, code) {
  const link = `${BACKEND_URL}/user/confirmdelete?code=${code}&email=${to}`;

  await sendEmail(to, "Confirmación de Eliminación de Cuenta - Key Master", `
  <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; color: #666666">
  <div style="background-color: #ffffff; border-radius: 10px; padding: 30px;">
    <h1 style="color: #333333; text-align: center;">Key Master</h1>
    <p style="text-align: center; font-size: 16px;">¡Hola!</p>
    <p style="text-align: center; font-size: 16px;">Has solicitado eliminar tu cuenta en Key Master. Por favor, confirma esta acción con el siguiente código:</p>
    <div style="text-align: center; padding: 20px; background-color: #43219B; border-radius: 8px;">
      <h2 style="color: #DDDDDD; font-size: 24px; margin: 0;">${code}</h2>
    </div>
    <p style="text-align: center; font-size: 16px;">Por razones de seguridad, este enlace expirará en ${EMAIL_CODE_EXPIRATION} minutos.</p>
    <p style="text-align: center; font-size: 16px;">Si no has solicitado esta acción, por favor ignora este mensaje.</p>
    <p style="text-align: center; font-size: 16px;">¡Gracias por ser parte de Key Master!</p>
    
    <p style="color: #999999; text-align: center; margin-top: 40px; font-size: 14px;">
      <span>Si el código no funciona, prueba este enlace:</span>
      <br/>
      <a style="color:ADD8E6" href="${link}">${link}</a>
    </p>

  </div>
  
  <p style="color: #999999; text-align: center; margin-top: 20px; font-size: 14px;">Este mensaje fue enviado automáticamente. Por favor, no respondas a este correo electrónico.</p>

</div>


  
  `);
}