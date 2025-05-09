const { Router } = require("express");
const { userModel } = require("../models/allModel");
const { z } = require("zod");

const userRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET



const userSchema = z.object({
    firstname: z.string().min(3, "First name should be greater than 3 characters."),
    lastname: z.string().min(3, "Last name should be greater than 3 characters."),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters.")
})



userRouter.post("/signup", async (req, res) => {


    try {

        const parsed = userSchema.safeParse(req.body)
        console.log("parsed:::", parsed)

        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation Error",
                errors: parsed.error.errors,
            });
        }



        const { email, firstname, lastname, password } = parsed.data;

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            })
        }



        const newUser = await userModel.create({
            firstname,
            lastname,
            email,
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