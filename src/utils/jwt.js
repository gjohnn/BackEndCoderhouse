import jwt from "jsonwebtoken";

const PRIVATE_KEY = "clavePrivadaSecreta"

export const generateToken = user => {
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "120s" });
    return token;
}

export const authToken = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) return res.status(401).json({ error: 'no token', msg: 'no token' })

    try {
        req.user = jwt.verify(token, PRIVATE_KEY)
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token', msg: 'The sent token is invalid or hasnt got access' })
    }

    next();
}