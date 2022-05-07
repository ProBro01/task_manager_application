import { Router } from "express";
import bodyparser from "body-parser"

// models
import { taskmodel } from "../models/tasks.js";

export const taskrouter = Router()

taskrouter.get("/getall", (req, res) => {
    try {
        taskmodel.find((err, data) => {
            if (err !== null) {
                throw err
            }
            else {
                res.send(data)
            }
        })
    }
    catch (err) {
        console.log(err)
    }
})

taskrouter.post("/addtask", bodyparser.json(), (req, res) => {
    try {
        var task = new taskmodel({
            name: req.body.name
        })
        task.save((err, data) => {
            if (err !== null) {
                throw err
            }
            else {
                res.send(data)
            }
        })
    }
    catch (err) {
        console.log(err)
        res.send("error")
    }
})

taskrouter.delete('/deletetask', bodyparser.json(), (req, res) => {
    try {
        var queryobject = {
            _id : req.body.taskid
        }
        taskmodel.findOneAndDelete(queryobject, (err, data) => {
            if(err === null){
                res.json({status : "success"})
            }
            else{
                res.status(505).json({ error: "error" })
            }
        })
    }
    catch (err) {
        console.log(err)
        res.status(505).json({ error: "error" })
    }
})

taskrouter.put("/updatetask", bodyparser.json(), (req, res) => {
    try {
        var findquery = {
            _id: req.body.taskid,
        }
        var updateobj = {}
        if (req.body.name !== "") {
            updateobj.name = req.body.name
        }
        updateobj.isCompleted = req.body.completed
        taskmodel.findOneAndUpdate(findquery, updateobj, (err, data) => {
            res.json({ status: "success" })
        })
    }
    catch (err) {
        console.log(err)
        res.status(505).json({ error: "error" })
    }
})