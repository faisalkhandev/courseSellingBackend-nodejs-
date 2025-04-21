const express = require("express")
const dotenv = require("dotenv");
const connectDB = require("./db/db");
const { userRouter } = require("./routes/userRoute");
const { courseRouter } = require("./routes/courseRoute");
const { adminRouter } = require("./routes/adminRoute");

const app = express();


// loads the env variables
dotenv.config();

connectDB()


app.use("/api/v1/user", userRouter)
app.use("/api/v1/course", courseRouter)
app.use("/api/v1/courseCreator", adminRouter)










const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log("🚀 server running at " + PORT)
})