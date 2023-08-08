import express from 'express'
import bcrypt from 'bcrypt'

import { auth, authAdmin } from '../middleware/auth.js';
//import { Router } from 'express'
import { userService } from '../services/users.service.js';
import { createHash, isValidPassword } from '../utils/moreUtils.js';
import passport from 'passport';
import RouterPass from './router.routes.js';

export default class SessionRouter extends RouterPass {
    init() {
        this.get('/login', async (req, res) => {
            try {
                return res.status(201).render('login', {})
            } catch (err) {
                console.log(err);
                let msg = "Sessions not working for now!"
                return res.status(404).render('errorPage', { msg })
            }
        })

        this.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/failLogin' }), async (req, res) => {
            try {
                req.session.user = req.user.email
                let validateUser = await userService.getUserByEmail(req.session.user)
                res.render("home", { validateUser, user: req.session.user })
            } catch (error) {
                if (!req.user) return res.render('errorPage', { msg: "Failed login" })
                console.log(error);
            }
        })

        this.get('/register', async (req, res) => {
            try {
                req.session.user = 'admin'
                return res.status(201).render('register', {})
            } catch (err) {
                console.log(err);
                let msg = "Sessions not working for now!"
                return res.status(404).render('errorPage', { msg })
            }
        })
        this.post('/register', passport.authenticate('register', { failureRedirect: '/api/session/failRegister' }), async (req, res) => {
            let { email } = req.body;
            let userFound = await userService.getUserByEmail(email)
            if (userFound) return res.send("User already registered")

            return res.render('login', {})
        })

        this.get('/failRegister', async (req, res) => {
            let msg = "Failed to register user"
            return res.render('register', { msg: 'user already registered' })
        })



        this.get('/failLogin', async (req, res) => {
            let msg = "Failed to login"
            return res.render('errorPage', { msg })
        })


        this.get('/loginRestorePass', async (req, res) => {
            try {
                return res.status(201).render('loginRestorePass', {})
            } catch (err) {
                console.log(err);
                let msg = "Restore password function is not working for now!"
                return res.status(404).render('errorPage', { msg })
            }
        })
        this.post('/loginRestorePass', async (req, res) => {
            try {
                let { email, password } = req.body
                let validateUser = await userService.getUserByEmail(email)
                if (!validateUser) {
                    return res.render('register', {})
                } else {
                    let newPass = createHash(password)
                    await userService.updateUserPass(email, newPass)
                    return res.status(201).render('login', {})
                }


            } catch (err) {
                console.log(err);
                let msg = "Restore password function is not working for now!"
                return res.status(404).render('errorPage', { msg })
            }
        })

        this.get('/profile', auth, async (req, res) => {
            let validateUser = await userService.getUserByEmail(req.session.user)
            return res.status(200).render('profile', { validateUser, user: req.session.user })
        })

        this.get('/logout', async (req, res) => {
            req.session.destroy(error => {
                return res.redirect("/")
            })
        })

        this.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { })

        this.get('/githubcallback', passport.authenticate('github', { failureRedirect: "/login" }), async (req, res) => {
            req.session.user = req.user;
            return res.redirect('/')
        })

    }
}

