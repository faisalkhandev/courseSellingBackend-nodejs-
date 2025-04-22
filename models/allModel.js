const mongoose = require("mongoose");
const { Schema } = mongoose;

// USER SCHEMA
const userSchema = new Schema({
    email: {
        type: String,
        unique: [true, 'Duplicate email is not allowed'],
        required: [true, "email is required."],
    },
    firstname: {
        type: String,
        required: [true, "firstname is required"],
    },
    lastname: {
        type: String,
        required: [true, "lastname is required."],
    },
    password: {
        type: String,
        required: [true, "password is required."],
    },
});

// COURSE SCHEMA
const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    price: {
        type: Number,
        required: true,
    },
    imageurl: String,
});

// CREATOR SCHEMA
const creatorSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// PURCHASE SCHEMA
const purchaseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",   // References the userModel
        required: true,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "course", // it References the courseModel
        required: true,
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
});

const userModel = mongoose.model("user", userSchema);
const courseModel = mongoose.model("course", courseSchema);
const creatorModel = mongoose.model("creator", creatorSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports = {
    userModel,
    courseModel,
    creatorModel,
    purchaseModel,
};
