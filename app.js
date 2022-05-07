import express from "express";
import path from "path"

// routers
import { taskrouter } from "./routes/taskroutes.js";

export const app = express()

app.use(express.static("public"))
app.use("/task", taskrouter)

app.get("/", (req, res) => {
    res.sendFile(path.join(path.resolve(), "src", "index.html"))
})