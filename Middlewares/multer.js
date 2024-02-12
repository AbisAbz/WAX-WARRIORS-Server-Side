// Middleware/multer.js
const multer = require('multer');
const storage = multer.diskStorage({});

const multerUpload = multer({ storage });
// const multerUpload = multer({ storage: multer.memoryStorage({}) });

module.exports = multerUpload;



