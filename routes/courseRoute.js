const { Router } = require("express")


const courseRouter = Router();


courseRouter.get("/allcoures", async function (req, res) {
    res.json({
        message: "allcourse"
    })
})


module.exports = {
    courseRouter
}