import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import authRouter from './app/auth/auth.route.js'
import userRouter from './app/user/user.route.js'
import messageRouter from './app/message/message.route.js'
import connectDB from "./common/db/mongoose.js";

const app = express();
// connect to DB
connectDB();
app.use(express.json());

// routes - map features
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/message', messageRouter);

// global error handler
app.use((err, req, res, next) => {
    if (err.isOperational === true) {
        return res.status(err.statusCode || 400).json({
            status: "error",
            message: err.message
        });
    }

    return res.status(500).json({
        status: "error",
        message: "Something went wrong on our end",
    });
});

app.listen(3000, () => console.log('Server started on port 3000'));