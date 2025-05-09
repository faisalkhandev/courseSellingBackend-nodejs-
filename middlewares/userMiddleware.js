const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config();

const jwt_token = process.env.JWT_SECRET

async function userMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization;


        if (!token) {
            return res.json({
                message: "token is missing in the heading."
            })
        }

        const verifyToken = jwt.verify(token, jwt_token)
        console.log("verifyToken:::", verifyToken)

        if (verifyToken) {
            req.userId = verifyToken.id
            next();
        }
        else {
            return res.status(400).json({
                message: "Invalid Token. Check the token."
            })
        }


    } catch (error) {
        console.log("error::", error)
        res.status(400).json({
            message: "internal server error while getting token."
        })
    }
}

module.exports = {
    userMiddleware
}