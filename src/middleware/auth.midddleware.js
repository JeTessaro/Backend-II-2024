const authentication = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send({ status: 'error', message: 'No tienes permisos para acceder' });
    }

    next();
}

module.exports = {authentication};