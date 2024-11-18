function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // Si está autenticado, continuar con la siguiente función
    }
    res.redirect('/login'); // Redirige a la página de login si no está autenticado
}

module.exports = isAuthenticated;
