const { Router } = require("express")


const adminRouter = Router();


adminRouter.get("/allcourses", async function (req, res) {
    res.json({
        message: "this is all courses for the admin"
    })
})



module.exports = {
    adminRouter
}