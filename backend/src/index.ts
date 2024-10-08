import express, { Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

const User = z.object({
    username: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    password: z.string(),
});



app.post('/signup', async (req: any, res: any) => {
    try {
        const userData = User.safeParse(req.body);

        if (!userData.success) {
            return res.status(400).json({ msg: "Validation failed", errors: userData.error });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                username: userData.data.username
            }
        });

        if (existingUser) {
            return res.status(409).json({
                msg: "User already exists"
            });
        }

        const newUser = await prisma.user.create({
            data: {
                username: userData.data.username,
                firstname: userData.data.firstname,
                lastname: userData.data.lastname,
                password: userData.data.password
            }
        });

        const token = jwt.sign({ username: userData.data.username }, JWT_SECRET, {expiresIn: '365d'});

        res.status(201).json({
            token: token,
            msg: "User created successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(403).json({
            msg: "Error occurred while processing the request"
        });
    }
});

app.listen(3000, () => {
    console.log("Server listening...");
});