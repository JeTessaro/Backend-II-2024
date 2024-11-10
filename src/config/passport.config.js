const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('passport-jwt')
const passportLocal = require('passport-local');
const GithubStrategy = require('passport-github2')
const UserDaoMongo = require('../daos/MONGO/usersDao.mongo');
const { createHash, isValidPassword } = require('../utils/bcrypt');
const { PRIVATE_KEY } = require('../utils/jsonwebtoken');

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt
const userService = new UserDaoMongo();

const initializePassport = () => {
    // Estrategia de GitHub
    passport.use('github', new GithubStrategy({
        clientID: 'Iv23lifYBTWEtYTjwfaW',
        clientSecret: '9987ede222de064a4a6526d84035cafb98c33857',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            let user = await userService.getUser({ email: profile._json.email })
            if (!user) {
                // registramos
                let newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    email: profile._json.email,
                    password: '123456'
                }
                let result = await userService.createUser(newUser)
                return done(null, result)
            }
            done(null, user)

        } catch (error) {
            return done(error)
        }
    }))

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, role } = req.body;

        console.log('Datos recibidos:', req.body);


        try {
            let userFound = await userService.getUser({ email: username });
            if (userFound) return done(null, false);

            // Verifica si el rol es válido
            if (!['user', 'user_premium', 'admin'].includes(role)) {
                return done(null, false, { message: 'Rol no válido' });
            }

            let newUser = {
                first_name,
                last_name,
                email: username,
                role,
                password: createHash(password)
            };
            let result = await userService.createUser(newUser);
            return done(null, result);

        } catch (error) {
            return done('Error al crear un usuario ' + error);
        }
    }));


    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await userService.getUser({ email: username });
            if (!user) return done(null, false);
            if (!isValidPassword(password, user.password)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userService.getUser({ _id: id })
        done(null, user)
    })
    const cookieExtractor = req => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['token'];
        }
        return token;
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }));

}

module.exports = {
    initializePassport
}