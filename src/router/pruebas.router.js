const { Router } = require('express')

const router = Router()

// router.get('/setcookie', (req, res) => {
//     res.cookie('coderCooke', 'Esta es una cookie poderosa', {maxAge:10000000}).send('setcookie')
// })

router.get('/setcookiesigned', (req, res) => {
    res.cookie('coderCooke', 'Esta es una cookie poderosa', {maxAge:10000000,signed: true}).send('setcookie')
})
router.get('/getcookie', (req, res) => {
    res.send(req.signedCookies)
})

router.get('/deletecookie', (req, res) => {
    res.clearCookie('coderCooke').send('deletecookie')
})

//Session

router.get('/sessions', (req, res) => {
    if(req.session.counter){
        req.session.counter++
        res.send(`Has visitado la página ${req.session.counter} veces`)
    } else {
        req.session.counter = 1
        res.send('Bienvenido a nuestra página, has visitado la página 1 vez')
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy( error => {
        if(error) return res.send({status: 'error', error})
        })
        res.send('Has cerrado la sesión')
})
module.exports = router