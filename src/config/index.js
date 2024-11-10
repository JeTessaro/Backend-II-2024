const { connect } = require('mongoose')
const dotenv = require('dotenv')
const { program } = require('../utils/commander')

const { mode } = program.opts()

dotenv.config({
    path: mode === 'development' ? './.env.development' : './.env.production'
})

console.log('variable nombre: ', process.env.NOMBRE)

exports.configObject = {
    port: process.env.PORT || 8080,
    private_key: process.env.PRIVATE_KEY,
    persistence: process.env.PERSISTENCE,
    gmail_user: process.env.GMAIL_USER,
    gmail_pass: process.env.GMAIL_PASS
}

module.exports.connectDB = async () => {
    console.log('Base de datos conectada en index')
    return await connect(process.env.MONGO_URL)
}

