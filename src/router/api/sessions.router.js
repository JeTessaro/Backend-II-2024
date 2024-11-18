const { Router } = require('express');
const { authentication } = require('../../middleware/auth.midddleware');
const UserDaoMongo = require('../../daos/MONGO/usersDao.mongo');
const bcrypt = require('bcrypt');
const { createHash, isValidPassword } = require('../../utils/bcrypt');
const passport = require('passport');
const { generateToken, authTokenMiddeleware } = require('../../utils/jsonwebtoken');
const req = require('express/lib/request');
const { passportCall } = require('../../middleware/passport/passportCall');
const { authorization } = require('../../middleware/passport/authorization.middleware');


const router = Router();
const userService = new UserDaoMongo();

router.get('/github', passport.authenticate('github', { scope:['user:email'] }), async (req, res) => {
})
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user
    res.redirect('/')
})

router.get('/failregister', async (req, res) => {
    console.log('fallo la estragia')
    res.send({status: 'error', error: 'fallo estrategia'})
})

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, role, password } = req.body;

        if (!email || !role || !password) {
            return res.status(400).send({ status: 'error', error: 'Deben proporcionar email y contraseña' });
        }

        const userFound = await userService.getUser({ email });
        if (userFound) {
            return res.status(400).send({ status: 'error', error: 'El email ya está en uso' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            first_name,
            last_name,
            email,
            role,
            password: createHash(password)
        };

        const result = await userService.createUser(newUser);
        res.redirect('/login')

    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', error: 'Error al registrar el usuario' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const userFound = await userService.getUser({ email });
   
    if (!userFound) {
        return res.status(404).send({ status: 'error', error: 'No existe el usuario' });
    }

    // Comparar la contraseña ingresada con la contraseña hasheada
    
    if (!isValidPassword(password, userFound.password)) {
        return res.status(401).send({ status: 'error', error: 'Credenciales incorrectas' });
    }

    const token = generateToken({id: userFound._id, role: userFound.role})
   
    res.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true       
    }).send({
        status:'success',
        data: userFound,
        token
    });
    
});


router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (!req.user) {
        return res.status(401).send({ status: 'error', error: 'Usuario no autenticado' });
    }
    console.log('User role:', req.user.role);
    const userRole = req.user.role; 
    console.log('User role:', userRole);

    if (userRole === 'admin' || userRole === 'user_premium') {
        return res.send({ dataUser: req.user, message: 'datos sensibles' });
    } else {
        return res.status(403).send({ status: 'error', error: 'Acceso denegado a datos sensibles' });
    }
});

// Change Password
router.post('/changepass', async (req, res) => {
    const { email, newPassword } = req.body;

    const userFound = await userService.getUser({ email });
   
    if (!userFound) {
        return res.status(404).send({ status: 'error', error: 'No existe el usuario' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    let result;
    try {
        console.log("Actualizando usuario:", { email }, { password: hashedPassword });
        result = await userService.updateUser({ email }, { password: hashedPassword });
    
    } catch (err) {
        return res.status(500).send({ status: 'error', error: 'Error al actualizar la contraseña' });
    }

    if (!result) {
        return res.status(500).send({ status: 'error', error: 'Error al actualizar la contraseña' });
    }

    if (result.modifiedCount === 0) {
        return res.status(400).send({ status: 'error', error: 'No se pudo cambiar la contraseña. Puede que ya sea la misma.' });
    }

    res.send('Contraseña cambiada correctamente');
});



router.get('/current', authTokenMiddeleware, (req, res) => {
    res.send('Datos sensibles');
});

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.send({ status: 'error', error });
        res.send('Has cerrado la sesión');
    });
});

module.exports = router;
