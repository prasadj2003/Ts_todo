import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken"
import { PrismaClient } from '@prisma/client'


const app = express();
const prisma = new PrismaClient()

app.use(express.json());
app.use(cors());

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;



app.post('/signup', async (req, res) => {
    const {username: string, firstName: string, lastName: string, passwoord: string} = req.body;

})

app.listen(3000, () => {
    console.log("server listening...")
})