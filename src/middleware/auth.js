export const auth = (req,res,next) =>{
    if(req.session.user){
        next();
    }else{
        return res.render('login',{})
    }
}

export const authAdmin = (req,res,next) =>{
    if(req.session.user == "admin"){
        next();
    }else{
        return res.render('login',{})
    }
}