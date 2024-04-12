import path from "path"
import multer from "multer"
import fs from "fs"
import sharp from "sharp"
import { v4 as uuidv4 } from 'uuid';
import { ERROR } from "../utils/requestManager.js";





const tempFolder = path.join('tmp')
const publicFolder = path.join('public')

// await fs.mkdir(tempFolder, { recursive: true }).catch((err) => {
//   console.error('Error creating temporary folder:', err);
// })


/**
 * Middleware for handling file uploads, including WebP conversion for non-SVG files.
 *
 * @param {string} field - The field name for the file upload.
 * @param {string} [folder='uploads'] - The destination folder for storing the uploaded files.
 * @returns {Function} Express middleware function.
 * 
 * @example usage:
 * app.post('/upload', makeUploader('image','profilePics/'),(req,res)=>{...})
 */
export function makeUploader(field, folder = 'uploads/') {

  // Configure multer storage options
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Check if the file is an SVG, store it directly in the public folder
      const isSvg = path.extname(file.originalname).toLowerCase() === '.svg';
      cb(null, isSvg ? path.join(publicFolder,folder) : tempFolder);
    },
    filename: (req, file, cb) => {
      // Generate a unique filename for the uploaded file
      const fileExtension = path.extname(file.originalname);
      const uniqueFileId = uuidv4()
      const uniqueFilename = `${uniqueFileId}${fileExtension}`;
      const isSvg = fileExtension.toLowerCase() === '.svg'

      req.uploadMetadata = {
        fileOriginalExtension: fileExtension,
        uniqueFilename: uniqueFilename,
        uniqueFileId: uniqueFileId,
        isSvg,
        outputFile: isSvg ? `${uniqueFileId}.svg` : `${uniqueFileId}.webp`,
      };

      cb(null, uniqueFilename);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  });

  const upload = multer({ storage });


  // Return Express middleware function
  return (req, res, next) => {
    upload.single(field)(req, res, async (err) => {

      // Check if a file was uploaded
      if (err) {
        return res.sendBad()
      }

      // Check if a file was uploaded
      if (!req.file) {
        return res.sendBad(ERROR.NO_FILE)
      }

      const inputFile = req.file.path;


      if (!req.uploadMetadata.isSvg) {
        // If it's not an SVG, convert to WebP
        const tempOutputFile = path.join(tempFolder, req.uploadMetadata.outputFile);

        try {
          const sharpResult = await sharp(inputFile)
            .resize({ width: 2048, height: 1080, fit: 'inside' }) // Resize with a maximum of 2048x1080
            .webp({ quality: 80 })
            .toFile(tempOutputFile);

          const finalOutputFile = path.join('public', folder, req.uploadMetadata.outputFile);
          // Set only the necessary properties for the response
          req.uploadMetadata.filename = path.basename(tempOutputFile);
          req.uploadMetadata.pathRemp = tempOutputFile;
          req.uploadMetadata.path = finalOutputFile
          req.uploadMetadata.size = fs.statSync(tempOutputFile).size;
          req.uploadMetadata.width = sharpResult.width;
          req.uploadMetadata.height = sharpResult.height;

          // Move the converted file to the final destination
          await fs.promises.rename(tempOutputFile, finalOutputFile);
        } catch (conversionError) {
          console.log(conversionError)
          return res.sendBad(ERROR.FILE_PROCESSING,"Error while processing your file")
        } finally {
          // Remove the original file
          fs.unlinkSync(inputFile);
        }
        

      } else {
        // If it's an SVG, store as is without conversion
        //svg is directly stored in final folder
        req.uploadMetadata.filename = path.basename(inputFile);
        req.uploadMetadata.size = fs.statSync(inputFile).size; // Include size for SVG
        req.uploadMetadata.path = inputFile;
      }

      next();
    });
  };
}
