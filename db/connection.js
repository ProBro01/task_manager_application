import mongoose from "mongoose"

export const connection = async (uri) => {
    mongoose.connect(uri, (err) => {
        if (err !== null) {
            console.log(err)
        }
        else {
            console.log("Successfully connected to database")
        }
    })
}

// "mongodb+srv://AryanYadav:ZUqyCHymXRPI9f2S@taskmanagercluster.nsxlv.mongodb.net/taskmanagerdatabase?retryWrites=true&w=majority"