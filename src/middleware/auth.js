export const auth = (req,res,next) =>{
    if(req.session.admin){
        next();
    }else{
        res.send('You are not authorized')
    }
}