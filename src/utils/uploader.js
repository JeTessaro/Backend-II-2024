const multer = require('multer')
const { dirname } = require('path')

// Configuración del storage para Multer para subir archivos a una carpeta llamada "uploads" en el directorio actual.
const storage = multer.diskStorage({
    destination: function (req, filem, cb) {
        cb(null, `${dirname(__dirname)}/public/uploads`)
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploader = multer({
    storage
})

module.exports = {
    uploader
}