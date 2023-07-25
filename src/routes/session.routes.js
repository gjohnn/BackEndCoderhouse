import express from 'express'
import bcrypt from 'bcrypt'
import { auth, authAdmin } from '../middleware/auth.js';
import { Router } from 'express'
import { userService } from '../services/users.service.js';
import { createHash, isValidPassword } from '../utils/moreUtils.js';
import passport from 'passport';

export const sessionRouter = Router();

sessionRouter.get('/register', async (req, res) => {
    try {
        req.session.user = 'admin'
        return res.status(201).render('register', {})
    } catch (err) {
        console.log(err);
        let msg = "Sessions not working for now!"
        return res.status(404).render('errorPage', { msg })
    }
})
sessionRouter.post('/register', passport.authenticate('register', { failureRedirect: '/api/session/failRegister' }), async (req, res) => {
    res.render('login', {})
})

sessionRouter.get('/failRegister', async (req, res) => {
    let msg = "Failed to register user"
    res.render('errorPage', { msg })
})


sessionRouter.get('/login', async (req, res) => {
    try {
        return res.status(201).render('login', {})
    } catch (err) {
        console.log(err);
        let msg = "Sessions not working for now!"
        return res.status(404).render('errorPage', { msg })
    }
})
sessionRouter.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/failLogin' }), async (req, res) => {
    try {
        req.session.user = req.user.email
        let validateUser = await userService.getUserByEmail(req.session.user)
        res.render("home", { validateUser, user: req.session.user })
    } catch (error) {
        if (!req.user) return res.render('errorPage', { msg: "Failed login" })
        console.log(error);
    }
}


    /*
    try {
        let user = req.body
        let validateUser = await userService.getUserByEmail(user.email)
        if (user.email == "adminCoder@coder.com" && user.password == "adminCod3r123") {
            req.session.user = 'admin'
            validateUser = user;
            return res.status(201).render('home', { validateUser, user: req.session.user })
        }
        if (!isValidPassword(validateUser, user.password) || !user) {
            return res.render('errorPage', { msg: "Password is not valid or invalid user" })
        } else {
            req.session.user = 'user'
            return res.status(201).render('home', { validateUser, user: req.session.user })
        }
    } catch (err) {
        console.log(err);
        let msg = "Login not working for now!"
        return res.status(404).render('errorPage', { msg })
    }
    */
)

sessionRouter.get('/failLogin', async (req, res) => {
    let msg = "Failed to login"
    res.render('errorPage', { msg })
})


sessionRouter.get('/loginRestorePass', async (req, res) => {
    try {
        return res.status(201).render('loginRestorePass', {})
    } catch (err) {
        console.log(err);
        let msg = "Restore password function is not working for now!"
        return res.status(404).render('errorPage', { msg })
    }
})
sessionRouter.post('/loginRestorePass', async (req, res) => {
    try {
        let { email, password } = req.body
        let validateUser = await userService.getUserByEmail(email)
        if (!validateUser) {
            res.render('register', {})
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

sessionRouter.get('/profile', auth, async (req, res) => {
    let validateUser = await userService.getUserByEmail(req.session.user)
    return res.status(200).render('profile', { validateUser, user: req.session.user })
})

sessionRouter.get('/logout', async (req, res) => {
    req.session.destroy(error => {
        return res.render('login', {})
    })
})

/*

if(user.email == "adminCoder@coder.com" && user.password == adminCod3r123){
            req.session.user = 'admin'
            validateUser = user;
            return res.status(201).render('home', { validateUser })
        }



sessionRouter.get('/login', (req, res) => {
    const nombre = req.query.name
    if (req.session.counter) {
        req.session.counter++
        return res.send(`You, ${req.session.name}, have visited us ${req.session.counter} times`)
    } else {
        req.session.counter = 1;
        req.session.name = nombre
        return res.send(`Welcome, ${req.session.name}!`)
    }


})

sessionRouter.get('/loginAdmin', (req, res) => {
    const {nombre} = req.query
    if (req.session.counter) {
        req.session.counter++
        return res.send(`You, ${req.session.name}, have visited us ${req.session.counter} times`)
    } else {
        req.session.counter = 1;
        req.session.name = nombre
        req.session.admin = true
        return res.send(`Welcome, ${req.session.name}!`)
    }
})


sessionRouter.get('/onlyAdmin', auth, (req, res) => {
    return res.send('Admin eyes only')
})

sessionRouter.get('/logout', async (req, res) => {
    return req.session.destroy(err => {
        if (!err) {
            return res.send("Logout ok")
        } else { 
            return res.send({ status: 'Logout ERROR', body: err }) 
        }
    })
})

/*

app.get('/session',(req,res)=>{
    if(req.session.counter){
      req.session.counter++
      return res.send(`You've visited us ${req.session.counter} times`)
    }else{
      req.session.counter = 1;
      return res.send("Welcome!")
    }
  })

  */