import "express-async-errors";
import mongoose from "mongoose";
import { app } from "./app"


const start = async () => {

    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined");
    }
    try {
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("Connected to MongoDb");
    } catch (error) {
        console.log(error);
    }

};

start();

app.listen(3000, () => {
    console.log("Auth Service listening on port 3000!!!");
})