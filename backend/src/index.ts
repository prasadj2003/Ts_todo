import express, { Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { PrismaClient } from '@prisma/client';
import authenticateToken from "./middleware/authentication";

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

const userSignin = z.object({
    username: z.string(),
    password: z.string()
})

app.post('/signin', authenticateToken, async (req: any, res: any) => {
    try {
        // user will signin with username and password
        const userData = userSignin.safeParse(req.body);

        if(!userData.success) {
            res.status(403).json({
                msg: "enter proper username and password"
            });
        }

        // if it passes validation then run a lookup in DB to find valid username and password

        const userInDB = await prisma.user.findUnique({
            where: {
                username: req.body.username,
            }
        });

        if(!userInDB || userInDB.password !== req.body.password) {
            res.json(401).json({
                msg: "incorrect email or password"
            })
        }

        res.status(201).json({
            msg: "signin successful"
        })
        // const token = jwt.sign({username: userInDB?.username}, JWT_SECRET)
    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).json({
            msg: "An error occurred while signing in"
        });
    }
})

// Todos specific routes

// getting todos
app.get('/todos', async (req: any, res: any) => {
    try {
        const todos = await prisma.todo.findMany();

        // No need to check for a falsy value, an empty array is a valid result.
        res.status(200).json({
            success: true,
            todos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Could not fetch todos",
        });
    }
});

// adding todos
const todoBody = z.object({
    title: z.string().trim().min(2),
    description: z.string().trim().min(2),
})

app.post('/todos', async (req: any, res: any) => {
    try {
        const todo = todoBody.safeParse(req.body);
        if(!todo.success) {
            return res.status(400).json({
                msg: "todo body is not in proper format"
            })
        }

        // if safely parsed by zod then push it in the database

        const todoInDB = await prisma.todo.create({
            data: {
                title: req.body.title,
                description: req.body.description
            }
        });

        res.status(200).json({
            msg: "todo added successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: "failed to add todo"
        });
    }
})

// updating todos

// id should be number it cannot be string according to our prisma schema
const updateTodoBody = z.object({
    title: z.string().trim().min(2),
    description: z.string().trim().min(2),
    completed: z.boolean(),
});

app.put('/todos/:id', async (req: any, res: any) => {
    const todo = updateTodoBody.safeParse(req.body);
    const todoId = parseInt(req.params.id, 10);

    if (!todo.success) {
        return res.status(400).json({
            msg: "Todo body not in proper format",
            errors: todo.error.issues,  // Return validation errors for clarity
        });
    }

    try {
        // 1. Find the todo by ID to ensure it exists
        const todoInDB = await prisma.todo.findUnique({
            where: { id: todoId },
        });

        // 2. If the todo is not found, return a 404 error
        if (!todoInDB) {
            return res.status(404).json({
                msg: "Todo not found",
            });
        }

        // 3. Prepare the update object dynamically
        const updateData: any = {};
        if (todo.data.title) updateData.title = todo.data.title;
        if (todo.data.description) updateData.description = todo.data.description;
        if (todo.data.hasOwnProperty('completed')) updateData.completed = todo.data.completed;

        // 4. Update the todo in the database
        const updatedTodo = await prisma.todo.update({
            where: { id: todoId },
            data: updateData,
        });

        // 5. Return the updated todo as a response
        return res.status(200).json({
            success: true,
            msg: "Todo updated successfully",
            todo: updatedTodo,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Error updating todo",
        });
    }
});



app.delete('/todos/:id', async(req: any, res: any) => {
    // complete this and edit put id should be passed in header
    // 1. find todo with id
    // 2. if todo does not exist return with appropriate error message
    //3. if todo exists delete from the database

    try {
        const todoID = parseInt(req.params.id, 10);

        const todoInDB = await prisma.todo.findUnique({
            where: {
                id: todoID
            }
        });

        if(!todoInDB) {
            return res.status(404).json({
                msg: "todo with id not found"
            });
        }

        const response = await prisma.todo.delete({
            where: {
                id: todoID
            }
        });

        return res.status(200).json({
            msg: "todo deleted successfully",
            todos: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "could not delete todo"
        })
    }
})


app.listen(3000, () => {
    console.log("Server listening...");
});