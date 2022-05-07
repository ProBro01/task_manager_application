import { app } from "./app.js";
import dotenv from "dotenv"

dotenv.config({ path: "./config.env" })
// database connection
import { connection } from "./db/connection.js"

const PORT = process.env.PORT

var start = async () => {
    try {
        await connection(process.env.DATABASEURI)
        app.listen(PORT, "192.168.247.14", () => {
            console.log(`App is listening on port ${PORT}`)
        })
    }
    catch (err) {
        console.log(err)
    }
}   

start()