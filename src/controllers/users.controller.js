const { userModel } = require('../daos/MONGO/models/users.model.js');
const { userService } = require('../services');
const { createHash, isValidPassword, generateToken } = require('../utils/bcrypt.js');

class UsersController {
    constructor() {
        this.userService = userService;
    }

    getUsers = async (req, res) => {
        const users = await this.userService.getUsers();
        res.send({ status: 'success', payload: users });
    };

    createUser = async (req, res) => {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !email || !password) {
            return res.status(400).send({ status: 'error', message: 'Todos los campos son requeridos' });
        }

        const userFound = await this.userService.getUser({ email });
        if (userFound) {
            return res.status(401).send({ status: 'error', message: 'El usuario con ese email ya existe' });
        }

        const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password),
        };

        const result = await this.userService.createUser(newUser);
        res.send({ status: 'success', data: result });
    };

    loginUser = async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ status: 'error', message: 'Todos los campos son requeridos' });
        }

        const userFound = await this.userService.getUser({ email });
        if (!userFound) {
            return res.status(401).send({ status: 'error', message: 'No se encuentra el usuario con ese email' });
        }

        if (!isValidPassword(password, userFound.password)) {
            return res.send({ status: 'error', message: 'Las credenciales no coinciden' });
        }

        const token = generateToken({
            id: userFound._id,
            email: userFound.email,
            role: userFound.role === 'admin',
        });

        res.send({ status: 'success', message: 'Logged in', token });
    };

    updateUser = async (req, res) => {
        const { uid } = req.params;
        const userToReplace = req.body;

        if (!userToReplace.first_name || !userToReplace.email) {
            return res.status(400).send({ status: 'error', message: 'Faltan datos' });
        }

        const result = await this.userService.updateUser({ _id: uid }, userToReplace);
        res.send({ status: 'success', message: 'Usuario actualizado' });
    };

    deleteUser = async (req, res) => {
        const { uid } = req.params;
        const result = await this.userService.deleteUser({ _id: uid });
        res.send({ status: 'success', message: 'Usuario borrado' });
    };

    
    checkEmail = async (req, res) => {
        try {
            const { email } = req.body;
            const user = await userModel.findOne({ email });

         if (user) {
             return res.status(200).json({ exists: true });
            } else {
            return res.status(404).json({ exists: false });
            }
        } catch (error) {
            console.error("Error al verificar el correo electrónico:", error);
            return res.status(500).json({ exists: false, error: "Internal Server Error" });
        }
};

}

module.exports = {
    UsersController,
};
