const { Router } = require("express");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { z } = require("zod");
const { adminModel, courseModel } = require("../models/allModel");
const { adminMiddleware } = require("../middlewares/adminMiddleware");

dotenv.config();
const adminRouter = Router();
const adminJwt = process.env.JWT_ADMIN_SECRET

const adminSchema = z.object({
    firstname: z
        .string()
        .min(3, "First name should be greater than 3 characters."),
    lastname: z.string().min(3, "Last name should be greater than 3 characters."),
    email: z.string().email("Email is invalid"),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

const courseSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.number().min(1, "Price must be at least 1"),
    imageurl: z.string().url("Image URL must be a valid URL").optional().default("https://media.istockphoto.com/id/1341046662/vector/picture-profile-icon-human-or-people-sign-and-symbol-for-template-design.jpg?s=612x612&w=0&k=20&c=A7z3OK0fElK3tFntKObma-3a7PyO8_2xxW0jtmjzT78="),
});

adminRouter.post("/signup", async (req, res) => {
    try {
        const parsed = adminSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation Error",
                errors: parsed.error.errors,
            });
        }

        const { email, firstname, lastname, password } = parsed.data;

        const existingAdmin = await adminModel.findOne({ email });

        if (existingAdmin) {
            return res.status(409).json({
                message: "Admin already exists",
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newAdmin = await adminModel.create({
            firstname,
            lastname,
            email,
            password: hashPassword,
        });

        res.status(201).json({
            message: "Admin created successfully.",
            user: {
                id: newAdmin._id,
                firstName: newAdmin.firstname,
                lastName: newAdmin.lastname,
                email: newAdmin.email,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

adminRouter.post("/signin", async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password invalid",
            });
        }

        const admin = await adminModel.findOne({ email });

        if (!admin) {
            return res.status(400).json({
                message: "Invalid credientals",
            });
        }

        const passwordMatch = await bcrypt.compare(password, admin?.password);

        if (!passwordMatch) {
            return res.json({
                message: "invalid credientals",
            });
        }

        const token = jwt.sign(
            {
                id: admin._id,
            },
            adminJwt,
            {
                expiresIn: "1h",
            }
        );

        res.status(200).json({
            message: "sign in Successfully.",
            token: token,
            admin: {
                id: admin._id,
                firstName: admin.firstname,
                lastName: admin.lastname,
                email: admin.email,
            },
        });
    } catch (error) {
        res.status(400).json({
            message: "internal server error.",
        });
    }
});

adminRouter.post("/createCourse", adminMiddleware, async function (req, res) {

    const adminId = req.adminId;

    const courseParsed = courseSchema.safeParse(req.body)

    if (!courseParsed.success) {
        res.status(400).json({
            message: 'Validation Errorr',
            errors: courseParsed.error.errors,
        })
    }

    const { title, description, price, imageurl } = courseParsed.data;


    const course = await courseModel.create({
        title,
        description,
        price,
        imageurl,
        createrId: adminId
    })

    res.status(200).json({
        message: "Course has been created.",
        course: {
            courseId: course._id,
            courseTitle: course.title,
            price: course.price

        }
    })


})



module.exports = {
    adminRouter
}