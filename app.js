import dotenv from 'dotenv';
import connectDB from './config/db.js';
import express from 'express';
import cookieParser from 'cookie-parser';

import { errorHandler } from './middleware/errorHandler.js';
import { userRouter } from './routes/userRoute.js';
import { productRouter } from './routes/productRoute.js';


dotenv.config()

const app = express();

process.on('uncaughtException',(error)=>{
    console.log(`Error: ${error.message}`);
    console.log('Shutting down the server due to uncaught exceptioni')
    process.exit(1);
})

app.use(cookieParser());
app.use(express.json());
app.use(express.json())

connectDB()


//routes
app.use('/api/users',userRouter);
app.use('api/product',productRouter);


app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log('Server runing at PORT -->', PORT)
})