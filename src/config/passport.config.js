import passport from "passport";
import local from 'passport-local'
import { userService } from '../services/users.service.js'
import { createHash, isValidPassword } from "../utils/moreUtils.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
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

export default initializePassport;