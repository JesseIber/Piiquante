const multer = require('multer');
const uuid4 = require('uuid').v4;
const path = require("path");

//la destination du fichier + générer un nom de fichier unique
const storage = multer.diskStorage({
    //destination de stockage
    destination: (req, file, callback) => {
        callback(null, "uploads");
    },
    filename: (req, file, callback) => {
        const fullName =
         "sauce_" + uuid4().replace(/-/g, "") +
         path.extname(file.originalname);
         callback(null, fullName);
    }
})

module.exports = multer({storage}).single('image');