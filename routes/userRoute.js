const { Router } = require("express")

const userRouter = Router();


userRouter.post("/signup", async function (req, res) {
    res.json({
        message: "sign up sucessfully."
    })
})
userRouter.post("/signin", async function (req, res) {
    res.json({
        message: "sign up sucessfully."
    })
})
userRouter.get("/purchase", async function (req, res) {
    res.json({
        message: "sign up sucessfully."
    })
})

module.exports = {
    userRouter
}