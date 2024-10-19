import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        res.status(403).json({
            msg: "Access denied no valid token provided"
        });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({
                msg: "Invalid token."
            });
        }

        // Store user information in request object
        req.user = user;
        next();
    });
}

export default authenticateToken;