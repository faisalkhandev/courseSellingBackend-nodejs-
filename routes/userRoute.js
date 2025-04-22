const { Router } = require("express");
const { userModel } = require("../models/allModel");

const userRouter = Router();


userRouter.post("/signup", async (req, res) => {


    try {
        const { email, firstname, lastname, password } = req.body;

        if (!email || !firstname || !lastname || !password) {
            return res.json({
                message: "Enter the requried fields."
            })
        }


        const newUser = await userModel.create({
            email,
            firstname,
            lastname,
            password,
        });

        res.status(201).json({
            message: "User created successfully.",
            user: newUser,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({ message: "Something went wrong." });
    }
});

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