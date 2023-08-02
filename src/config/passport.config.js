import passport from "passport";
import local from 'passport-local'
import jwt from "passport-jwt";
import GithubStrategy from 'passport-github2'
import { userService } from '../services/users.service.js'
import { createHash, isValidPassword } from "../utils/moreUtils.js";
import { generateToken, authToken } from "../utils/jwt.js";


const LocalStrategy = local.Strategy;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['authToken']
    };
    return token;
}


const initializePassport = () => {

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: 'privateKey',
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))


    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.316f172c464ac39b',
        clientSecret: "d23adf7dd0506ed9049ab1671e8cabbe888ff185",
        callbackURL: 'http://localhost:8080/api/session/githubcallback',
        scope: ['user:email']

    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let userEmail = profile.emails[0].value;
            let user = await userService.getUserByEmail(userEmail)
            if (!user) {
                let newUser = {
                    first_name: profile._json.login,
                    last_name: 'a',
                    email: userEmail,
                    password: 'a',
                }
                let { first_name, last_name, email, password } = newUser;
                let result = await userService.addUser({ first_name, last_name, email, password })
                done(null, result)
            } else {
                done(null, user)
            }
        } catch (error) {
            console.log(error);
            done(error)
        }
    }))

    

    passport.use('register', new LocalStrategy({
        passReqToCallback: true, usernameField: 'email'
    }, async (req, username, password, done) => {
        try {
            let { first_name, last_name, email, password } = req.body
            let userFound = await userService.getUserByEmail(email)
            if (userFound) return done(null, false)
            let createUser = await userService.addUser({ first_name, last_name, email, password: createHash(password) })
            return done(null, createUser)
        } catch (error) {
            return done('User cannot be created: ' + error)
        }
    }));


    passport.use('login', new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
        try {
            let result = await userService.getUserByEmail(username);
            if (!result || isValidPassword(result, result.password)) return done(null, false);
            delete result.password;
            return done(null, result)
        } catch (error) {
            console.log(error);
        }
    }))



    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await userService.getUserById(id);
        done(null, user);
    })
}
/*

const initializePassport = () => {
    
    }))










    
}
*/
export default initializePassport;