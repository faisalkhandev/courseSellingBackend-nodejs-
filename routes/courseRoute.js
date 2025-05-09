const { Router } = require("express");
const { adminMiddleware } = require("../middlewares/adminMiddleware");


const courseRouter = Router();


courseRouter.get("/createCourse", adminMiddleware, async function (req, res) {
    res.json({
        message: "sir, admin token chal para."
    })

})


module.exports = {
    courseRouter
}