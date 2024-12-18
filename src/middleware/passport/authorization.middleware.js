const authorization = role => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ status: 'Error', message: 'Unauthorized' });
        if(req.user.role != role) return res.status(401).send({error: 'not permissions'})    
            next()
        }
}

module.exports = {
    authorization
}