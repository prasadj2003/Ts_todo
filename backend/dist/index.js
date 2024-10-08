"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const authentication_1 = __importDefault(require("./middleware/authentication"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";
const User = zod_1.z.object({
    username: zod_1.z.string(),
    firstname: zod_1.z.string(),
    lastname: zod_1.z.string(),
    password: zod_1.z.string(),
});
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = User.safeParse(req.body);
        if (!userData.success) {
            return res.status(400).json({ msg: "Validation failed", errors: userData.error });
        }
        const existingUser = yield prisma.user.findUnique({
            where: {
                username: userData.data.username
            }
        });
        if (existingUser) {
            return res.status(409).json({
                msg: "User already exists"
            });
        }
        const newUser = yield prisma.user.create({
            data: {
                username: userData.data.username,
                firstname: userData.data.firstname,
                lastname: userData.data.lastname,
                password: userData.data.password
            }
        });
        const token = jsonwebtoken_1.default.sign({ username: userData.data.username }, JWT_SECRET, { expiresIn: '365d' });
        res.status(201).json({
            token: token,
            msg: "User created successfully"
        });
    }
    catch (error) {
        console.error(error);
        res.status(403).json({
            msg: "Error occurred while processing the request"
        });
    }
}));
const userSignin = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string()
});
app.post('/signin', authentication_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // user will signin with username and password
        const userData = userSignin.safeParse(req.body);
        if (!userData.success) {
            res.status(403).json({
                msg: "enter proper username and password"
            });
        }
        // if it passes validation then run a lookup in DB to find valid username and password
        const userInDB = yield prisma.user.findUnique({
            where: {
                username: req.body.username,
            }
        });
        if (!userInDB || userInDB.password !== req.body.password) {
            res.json(401).json({
                msg: "incorrect email or password"
            });
        }
        res.status(201).json({
            msg: "signin successful"
        });
        // const token = jwt.sign({username: userInDB?.username}, JWT_SECRET)
    }
    catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).json({
            msg: "An error occurred while signing in"
        });
    }
}));
app.listen(3000, () => {
    console.log("Server listening...");
});
