import express, { Request, Response } from "express";
import { body } from "express-validator";

import {User} from "../models/user"

import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError } from "../errors/bad-request-error";

import {Password} from "../services/password";

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
    async (req: Request, res: Response) => {
        const {email,password}=req.body;
        console.log(`signin user validated ${email}`)
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            console.log('Invalid credentials');
            throw new BadRequestError('Invalid credentials');
        }

        const passwordsMatch= await Password.compare(existingUser.password,password);
        if (!passwordsMatch){
             console.log('Invalid credentials');
            throw new BadRequestError('Invalid credentials');
        };

        
        //generate JWT

        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_KEY!);

        //Store it in session object

        req.session = { jwt: userJwt };

        res.status(200).send(existingUser);
    });


export { router as signinRouter };