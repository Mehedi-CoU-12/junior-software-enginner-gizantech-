import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

const isAuthenticated=async (req,res,next) => {
    try {
        const s=req?.headers?.cookie;
        const token=s.split('=')[1];
    
        if(!token)
            return res.status(400).json({
                message:"please login to access this resource"
        });
    
        const decodedToken=await jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decodedToken.userId);
    
        if(!user)
            return res.status(400).json({
                message:"please login to access this resource"
        });
    
        req.user=user;
        next();
        
    } catch (error) {
        console.log(error);
    }
}

const isRoleAdmin=(role)=>{
    return (req,res,next)=>{

        if(role!==req.user.role)
            throw new ApiError(403,`Role : ${req.user.role} is not allowed to access this resource`);
        else
        next();
    }

}

export {isAuthenticated,isRoleAdmin};