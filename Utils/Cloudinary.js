const cloudinary = require('cloudinary').v2  //v2 is the version of cloudinary, if you didn't give the version it will automatically take the newest version 

cloudinary.config({
    cloud_name: 'dz3mvjcpj',
    api_key: '637589351573522',
    api_secret: 'CbzYabv6Tq0vffxkdc4spbNvYZo',
    secure: true
})

const uploadToCloudinary = async (path, folder) => {
    try {
        console.log("inside uploadToCloudinary");
        const data = await cloudinary.uploader.upload(path, { folder });
        console.log(" iam the data ", data);
        return { url: data.url, public_id: data.public_id };
    } catch (error) {
        throw error;
    }
}

const multiUploadCloudinary = async (files, folder) => {
    try {
        const uploadImages = []
        for (const file of files) {
            
            const { path } = file
            const result = await uploadToCloudinary(path, folder)
            if (result) uploadImages.push(result.url)
        }
        return uploadImages
    } catch (error) {
        console.log("iam the ,ulticloudinary function error ", error);
    }
}


module.exports = {
    uploadToCloudinary,
    multiUploadCloudinary,
}