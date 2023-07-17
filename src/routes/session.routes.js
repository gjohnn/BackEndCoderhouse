import express from 'express'
import { auth } from '../middleware/auth.js';
import { Router } from 'express'

export const sessionRouter = Router();

sessionRouter.get('/register', async(req,res)=>{
    try{
        req.session.user='admin'
        return res.status(201).render('register',{})
    }catch(err){
        console.log(err);
        let msg = "Sessions not working for now!"
        return res.status(404).render('errorPage',{msg})
    }
})
sessionRouter.post('/register', async(req,res)=>{
    try{
        req.session.user='admin'
        console.log(req.body);
        return res.status(201).render('login',{})
    }catch(err){
        console.log(err);
        let msg = "Register not working for now!"
        return res.status(404).render('errorPage',{msg})
    }
})
sessionRouter.get('/login', async(req,res)=>{
    try{
        req.session.user='admin'
        return res.status(201).render('login',{})
    }catch(err){
        console.log(err);
        let msg = "Sessions not working for now!"
        return res.status(404).render('errorPage',{})
    }
})
sessionRouter.post('/login', async(req,res)=>{
    try{
        console.log(req.body);
        return res.status(201).render('login',{})
    }catch(err){
        console.log(err);
        let msg = "Register not working for now!"
        return res.status(404).render('errorPage',{msg})
    }
})

/*
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