import { Router } from "express"; 
const router = Router()
export default router


router.post("/register", async (req,res)=>{
  res.send("HELLO")
})



// // Function to encrypt data using the public key (client)
// export function encryptData(data, publicKey) {
//   const encryptedData = crypto.publicEncrypt(
//     {
//       key: publicKey,
//       padding: crypto.constants.RSA_PKCS1_PADDING,
//     },
//     Buffer.from(data)
//   );
//   return encryptedData.toString('base64');
// }

// // Function to decrypt data using the private key
// export function decryptData(encryptedData, privateKey) {
//   const decryptedData = crypto.privateDecrypt(
//     {
//       key: privateKey,
//       padding: crypto.constants.RSA_PKCS1_PADDING,
//     },
//     Buffer.from(encryptedData, 'base64')
//   );
//   return decryptedData.toString();
// }


// Generate key pair
// const { publicKey, privateKey } = generateKeyPair();

// // Encrypt data
// const data = 'Sensitive information';
// const encryptedData = encryptData(data, publicKey);
// console.log('Encrypted data:', encryptedData);

// // Decrypt data
// const decryptedData = decryptData(encryptedData, privateKey);
// console.log('Decrypted data:', decryptedData);