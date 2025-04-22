const express = require("express")
const dotenv = require("dotenv");
const connectDB = require("./db/db");
const { userRouter } = require("./routes/userRoute");
const { courseRouter } = require("./routes/courseRoute");
const { adminRouter } = require("./routes/adminRoute");


const app = express();

app.use(express.json());

// loads the env variables
dotenv.config();

// connecting Database
connectDB();


// Prefix Routes
app.use("/api/v1/user", userRouter)
app.use("/api/v1/course", courseRouter)
app.use("/api/v1/courseCreator", adminRouter)


//PORT
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log("🚀 server running at " + PORT)
})