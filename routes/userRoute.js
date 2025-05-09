const { Router } = require("express");
const { userModel } = require("../models/allModel");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")

const userRouter = Router();

dotenv.config();

const JWT = process.env.JWT_SECRET;


const userSchema = z.object({
    firstname: z
        .string()
        .min(3, "First name should be greater than 3 characters."),
    lastname: z.string().min(3, "Last name should be greater than 3 characters."),
    email: z.string().email("Email is invalid"),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

userRouter.post("/signup", async (req, res) => {
    try {
        const parsed = userSchema.safeParse(req.body);
        console.log("parsed:::", parsed);

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
                message: "User already exists",
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            firstname,
            lastname,
            email,
            password: hashPassword,
        });

        res.status(201).json({
            message: "User created successfully.",
            user: {
                id: newUser._id,
                firstName: newUser.firstname,
                lastName: newUser.lastname,
                email: newUser.email,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

userRouter.post("/signin", async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password invalid",
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credientals",
            });
        }

        const passwordMatch = await bcrypt.compare(password, user?.password);

        if (!passwordMatch) {
            return res.json({
                message: "invalid credientals",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            JWT,
            {
                expiresIn: "1h",
            }
        );

        res.status(200).json({
            message: "sign in Successfully.",
            token: token,
            user: {
                id: user._id,
                firstName: user.firstname,
                lastName: user.lastname,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(400).json({
            message: "internal server error.",
        });
    }
});


module.exports = {
    userRouter,
};
