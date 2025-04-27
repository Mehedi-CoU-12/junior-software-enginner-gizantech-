import express from 'express';
import { upload } from '../middleware/multer.js';
import { 
    deleteUser, 
    getAllUsers, 
    getSingleUser, 
    loginUser, 
    registerUser, 
    updateUser
} from '../controllers/userController.js';

import { isAuthenticated, isRoleAdmin } from '../middleware/isAuthenticated.js';

const userRouter=express.Router();

userRouter.post('/login',loginUser);
userRouter.post('/register',upload.single('avatar'),registerUser);

//protected routes
userRouter.put('/update',isAuthenticated,updateUser);
userRouter.get('/alluser',isAuthenticated,isRoleAdmin('admin'),getAllUsers);
userRouter.delete('/delete/:id',isAuthenticated,isRoleAdmin('admin'),deleteUser);
userRouter.get('/singleuser/:id',isAuthenticated,isRoleAdmin('admin'),getSingleUser);

export {userRouter};