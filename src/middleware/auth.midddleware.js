const authentication = (req, res, next) => {
    if (req.session.user.email !== 'et@gmail.com' || !req.session.user.isAdmin) {
        return res.status(401).send({ status: 'error', message: 'No tienes permisos para acceder' });
    }
    next();
}

module.exports = {authentication};