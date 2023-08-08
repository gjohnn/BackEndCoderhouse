import bcrypt from 'bcrypt'
import  jwt  from 'jsonwebtoken'

const secret = 'clavesecreta'
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)


export const generateCustomResponses = (req, res, next) => {
    res.sendSuccess = payload => res.send({ status: "Success", payload });
    res.sendServerError = error => res.status(500).send({ status: "error", error })
    res.sendUserError = error => res.status(400).send({ status: "error", error })
    next();
}

export const handlePolicies = policies =>(req,res,next)=>{
    if(policies[0]==="PUBLIC") return next();
    const authHeaders = req.headers.authorization;
    if(!authHeaders) return res.status(401).send({status:'error', error:'Unauthorized'})
    const token = authHeaders.split(" ")[1]
    let user = jwt.verify(token,secret);
    if(!policies.includes(user.normalize.toUpperCase())) return res.status(403).send({status:'error', error:'No permissions'})
    req.user = user;
    next()
}