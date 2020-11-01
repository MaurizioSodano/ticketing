import express, { Request, Response } from "express";
import { body } from "express-validator";


import { validateRequest } from "../middlewares/validate-request";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/api/users/signin", [
    body('email')
        .isEmail()
        .withMessage("Email must be vaild"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("You must supply a password")
],
    validateRequest,
    (req: Request, res: Response) => {


        res.send("sign in current user");
    });


export { router as signinRouter };