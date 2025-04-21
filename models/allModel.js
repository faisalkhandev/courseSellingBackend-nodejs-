const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
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

// New: purchaseSchema with relations
const purchaseSchema = new Schema({
    userId: {},
    courseId: {},
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
