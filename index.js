const express = require("express")
const dotenv = require("dotenv");
const connectDB = require("./db/db");

const app = express();


// loads the env variables
dotenv.config();


connectDB












const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log("🚀 server running at " + PORT)
})