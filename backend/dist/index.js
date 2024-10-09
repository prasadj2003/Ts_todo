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
// Todos specific routes
// getting todos
app.get('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todos = yield prisma.todo.findMany();
        // No need to check for a falsy value, an empty array is a valid result.
        res.status(200).json({
            success: true,
            todos,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Could not fetch todos",
        });
    }
}));
// adding todos
const todoBody = zod_1.z.object({
    title: zod_1.z.string().trim().min(2),
    description: zod_1.z.string().trim().min(2),
});
app.post('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = todoBody.safeParse(req.body);
        if (!todo.success) {
            return res.status(400).json({
                msg: "todo body is not in proper format"
            });
        }
        // if safely parsed by zod then push it in the database
        const todoInDB = yield prisma.todo.create({
            data: {
                title: req.body.title,
                description: req.body.description
            }
        });
        res.status(200).json({
            msg: "todo added successfully"
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            msg: "failed to add todo"
        });
    }
}));
// updating todos
// id should be number it cannot be string according to our prisma schema
const updateTodoBody = zod_1.z.object({
    id: zod_1.z.number(),
    title: zod_1.z.string().trim().min(2),
    description: zod_1.z.string().trim().min(2),
    completed: zod_1.z.boolean()
});
app.put('/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todo = updateTodoBody.safeParse(req.body);
    if (!todo.success) {
        return res.status(400).json({
            msg: "Todo body not in proper format",
        });
    }
    try {
        // 1. Find the todo by ID to ensure it exists
        const todoInDB = yield prisma.todo.findUnique({
            where: {
                id: todo.data.id,
            },
        });
        // 2. If the todo is not found, return a 404 error
        if (!todoInDB) {
            return res.status(404).json({
                msg: "Todo not found",
            });
        }
        // 3. Prepare the update object dynamically
        const updateData = {};
        if (todo.data.title)
            updateData.title = todo.data.title;
        if (todo.data.description)
            updateData.description = todo.data.description;
        if (todo.data.completed)
            updateData.completed = todo.data.completed;
        // 4. Update the todo in the database
        const updatedTodo = yield prisma.todo.update({
            where: {
                id: todo.data.id,
            },
            data: updateData,
        });
        // 5. Return the updated todo as a response
        res.status(200).json({
            success: true,
            msg: "Todo updated successfully",
            todo: updatedTodo,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error updating todo",
        });
    }
}));
app.listen(3000, () => {
    console.log("Server listening...");
});
