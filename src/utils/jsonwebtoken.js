//const req = require('express/lib/request')
const jwt = require('jsonwebtoken')

const PRIVATE_KEY = "PalabraSecreta#"

const generateToken = (user) => jwt.sign(user, PRIVATE_KEY, { expiresIn: '1d' })

const authTokenMiddeleware = (req, res, next) => {
    const authheader = req.headers['authorization']
    console.log(authheader)
    if(!authheader) return res.status(401).send({status: 'error', error: 'not authenticaded'})   
    const token = authheader.split(' ')[1]
    jwt.verify(token, PRIVATE_KEY, (error, usuarioExtraidoDelToken) => {
        if(err) return res.status(403).send({status: 'error', error: 'invalid token'})
        req.user = usuarioExtraidoDelToken
        next()
    })
}

module.exports = {
    generateToken,
    authTokenMiddeleware,
    PRIVATE_KEY
}