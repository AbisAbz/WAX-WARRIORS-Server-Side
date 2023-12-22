import cloudinary from "cloudinary";
import { config } from "dotenv";
import * as fileType from "file-type";
import { createReadStream } from "fs";
import { promisify } from "util";
config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
});

const uploadToClodinary = async (path, folder) => {
    try {
        const data = await cloudinary.v2.uploader.upload(path, { folder })
        return { url: data.url, public_id: data.public_id }
    } catch (error) {
        console.log(error);
    }
}




const readFile = promisify(createReadStream);

export const validateImageFormat = async (path) => {
    try {
        const buffer = await readFile(path);
        const type = fileType(buffer);

        if (!type || !["image/jpeg", "image/png", "image/avif"].includes(type.mime))  throw new Error("Invalid image format");
        
    } catch (error) {
        throw error;
    }
};

export default uploadToClodinary;