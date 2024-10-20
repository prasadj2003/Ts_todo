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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const User = zod_1.z.object({
    username: zod_1.z.string(),
    firstname: zod_1.z.string(),
    lastname: zod_1.z.string(),
    password: zod_1.z.string(),
});
// app.post('/signup', async (req: any, res: any) => {
//     try {
//         const userData = User.safeParse(req.body);
//         if (!userData.success) {
//             return res.status(400).json({ msg: "Validation failed", errors: userData.error });
//         }
//         const existingUser = await prisma.user.findUnique({
//             where: {
//                 username: userData.data.username
//             }
//         });
//         if (existingUser) {
//             return res.status(409).json({
//                 msg: "User already exists"
//             });
//         }
//         const newUser = await prisma.user.create({
//             data: {
//                 username: userData.data.username,
//                 firstname: userData.data.firstname,
//                 lastname: userData.data.lastname,
//                 password: userData.data.password
//             }
//         });
//         const token = jwt.sign({ username: userData.data.username }, JWT_SECRET, {expiresIn: '365d'});
//         localStorage.setItem("token", token)
//         res.status(201).json({
//             token: token,
//             msg: "User created successfully"
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(403).json({
//             msg: "Error occurred while processing the request"
//         });
//     }
// });
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the user data
        const userData = User.safeParse(req.body);
        if (!userData.success) {
            // If validation fails, return a 400 response with validation errors
            return res.status(400).json({ msg: "Validation failed", errors: userData.error });
        }
        // Check if the user already exists
        const existingUser = yield prisma.user.findUnique({
            where: {
                username: userData.data.username
            }
        });
        if (existingUser) {
            // If user exists, return a 409 conflict
            return res.status(409).json({
                msg: "User already exists"
            });
        }
        // Create a new user in the database
        const newUser = yield prisma.user.create({
            data: {
                username: userData.data.username,
                firstname: userData.data.firstname,
                lastname: userData.data.lastname,
                password: userData.data.password // Ideally, hash the password before saving!
            }
        });
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ username: userData.data.username }, JWT_SECRET, { expiresIn: '365d' });
        // Send the token back in the response (frontend will store it)
        res.status(201).json({
            token: token,
            msg: "User created successfully"
        });
    }
    catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({
            msg: "Error occurred while processing the request"
        });
    }
}));
const userSignin = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string()
});
app.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parse user input
        const userData = userSignin.safeParse(req.body);
        if (!userData.success) {
            return res.status(403).json({
                msg: "Enter proper username and password"
            });
        }
        // Find user in the database by username
        const userInDB = yield prisma.user.findUnique({
            where: {
                username: req.body.username,
            }
        });
        // Check if user exists and if the password matches
        if (!userInDB || userInDB.password !== req.body.password) {
            return res.status(401).json({
                msg: "Incorrect username or password"
            });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ username: userInDB.username }, JWT_SECRET, { expiresIn: '365d' });
        // Respond with the token and success message
        return res.status(200).json({
            token: token,
            msg: "Sign-in successful"
        });
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
    description: zod_1.z.string().trim()
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
    completed: zod_1.z.boolean(),
});
app.put('/todos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todo = updateTodoBody.safeParse(req.body);
    const todoId = parseInt(req.params.id, 10);
    if (!todo.success) {
        return res.status(400).json({
            msg: "Todo body not in proper format",
            errors: todo.error.issues, // Return validation errors for clarity
        });
    }
    try {
        // 1. Find the todo by ID to ensure it exists
        const todoInDB = yield prisma.todo.findUnique({
            where: { id: todoId },
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
        if (todo.data.hasOwnProperty('completed'))
            updateData.completed = todo.data.completed;
        // 4. Update the todo in the database
        const updatedTodo = yield prisma.todo.update({
            where: { id: todoId },
            data: updateData,
        });
        // 5. Return the updated todo as a response
        return res.status(200).json({
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
app.delete('/todos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // complete this and edit put id should be passed in header
    // 1. find todo with id
    // 2. if todo does not exist return with appropriate error message
    //3. if todo exists delete from the database
    try {
        const todoID = parseInt(req.params.id, 10);
        const todoInDB = yield prisma.todo.findUnique({
            where: {
                id: todoID
            }
        });
        if (!todoInDB) {
            return res.status(404).json({
                msg: "todo with id not found"
            });
        }
        const response = yield prisma.todo.delete({
            where: {
                id: todoID
            }
        });
        return res.status(200).json({
            msg: "todo deleted successfully",
            todos: response
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "could not delete todo"
        });
    }
}));
app.get('/appointments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointmentArray = yield prisma.appointment.findMany();
        res.status(200).json({
            appointmentArray,
            msg: "appointments fetched successfully"
        });
    }
    catch (error) {
        console.log("error fetching appointments: ", error);
        return res.status(403).json({
            msg: "error fetching appointments"
        });
    }
}));
const appointmentBody = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    dateTime: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid dateTime format",
    }),
});
app.post('/appointments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = appointmentBody.safeParse(req.body);
    if (!response.success) {
        return res.status(403).json({
            msg: "Appointment body not in proper format",
        });
    }
    try {
        const { title, dateTime } = req.body; // Get the combined datetime from the frontend
        const appointment = yield prisma.appointment.create({
            data: {
                title: title,
                dateTime: new Date(dateTime), // Prisma expects DateTime as a JS Date object
            },
        });
        return res.status(200).json({
            appointment: appointment,
            msg: "Appointment added successfully",
        });
    }
    catch (error) {
        console.log("Error adding appointment: ", error);
        return res.status(403).json({
            msg: "Error adding appointment",
        });
    }
}));
app.listen(3000, () => {
    console.log("Server listening...");
});
