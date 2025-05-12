const { Router } = require("express");
const { userModel, courseModel, purchaseModel } = require("../models/allModel");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
const { userMiddleware } = require("../middlewares/userMiddleware");
const { default: mongoose } = require("mongoose");

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
                expiresIn: "3h",
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


userRouter.post("/purchase/:courseId", userMiddleware, async function (req, res) {

    const userId = req.userId;
    const { courseId } = req.params;

    try {
        // ✅ Validate courseId format first
        if (!mongoose.isValidObjectId(courseId)) {
            return res.status(400).json({ message: "Invalid course ID format." });
        }

        // check if the course exist
        const courseExist = await courseModel.findById(courseId)
        console.log("courseExist:::", courseExist)
        if (!courseExist) {
            return res.status(404).json({
                message: `this course doesn't exist)`
            })
        }

        // Check if user already purchased the course
        const existPurchase = await purchaseModel.findOne({
            userId,
            courseId
        })

        if (existPurchase) {
            return res.status(200).json({
                message: "you have already purchase this course."
            })
        }

        // Create purchase record
        const newPurchase = await purchaseModel.create({
            userId,
            courseId
        })

        res.status(201).json({
            message: "Course purchased successfully",
            purchase: newPurchase,
        });


    } catch (error) {
        console.error("Error during purchase:", error);  // Log the error to see the stack trace
        res.status(500).json({
            message: "Internal server error. Please try again later.",
            error: error.message  // Log the actual error message
        });
    }



})



userRouter.get("/purchase", userMiddleware, async function (req, res) {
    const userId = req.userId;

    const purchaseCourse = await courseModel.find({
        userId
    })

    res.json({
        message: `these are the courses purchased by the ${userId}`,
        purchaseCourse
    })

})




module.exports = {
    userRouter,
};
