const { Router } = require('express');
const UserDaoMongo = require('../../daos/MONGO/usersDao.mongo.js');
const { passportCall } = require('../../middleware/passport/passportCall.js');
const { UsersController } = require('../../controllers/users.controller.js');

const router = Router();
const usersService = new UserDaoMongo();

const {
    getUsers,
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    checkEmail
} = new UsersController(usersService); 
// Ruta para obtener el usuario actual
router.get('/', passportCall('jwt'), getUsers );

// Ruta para registrar un nuevo usuario
router.post('/register', createUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta para obtener datos sensibles del usuario actual
router.get('/current', passportCall('jwt'), (req, res) => {
    res.send('datos sensibles'); 
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
    res.send('logout'); 
});

// Ruta para actualizar un usuario específico
router.put('/:uid', updateUser);

// Ruta para eliminar un usuario específico
router.delete('/:uid', deleteUser);

// Ruta para verificar si el email ya está en uso

router.post('/check-email', checkEmail);

module.exports = router;

