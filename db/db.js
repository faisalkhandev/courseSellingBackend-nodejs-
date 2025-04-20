const mongoose = require("mongoose")



async function connectDB() {

    try {
        const con = await mongoose.connect(process.env.MONGO_URI)
        console.log(`DB connect = ${con.connection.host}`)
    }

    catch (error) {
        console.log("Error while connecting " + error.message)
        process.exit(1)
    }

}

module.exports = connectDB