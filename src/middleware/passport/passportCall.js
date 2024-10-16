const passport = require('passport')


const passportCall = strategy => {
    return async (req, res, next) => {
        try {
            await passport.authenticate(strategy, { session: false }, (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(401).send({ status: 'error', error: 'Unauthorized' });
                }
                req.user = user;
                next();
            })(req, res, next);
        } catch (error) {
            console.error('Error en passportCall', error)
            res.status(500).json({ message: 'Error interno' })
        }
       
    }
}

module.exports =  {
    passportCall
}