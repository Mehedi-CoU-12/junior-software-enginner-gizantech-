import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { v2 as cloudinary } from 'cloudinary'
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
}

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      res.status(400)
      throw new Error('Missing fields')
    }

    if (!req?.file || !req?.file?.path) {
        return res.status(400).json({ message: 'No file uploaded!' });
    }

    const uploadResult = await uploadOnCloudinary(req?.file?.path);

    const userExists = await User.findOne({ email })
    if (userExists) {
      res.status(409)
      throw new Error('Email already taken')
    }

    const user = await User.create({ 
        name, 
        email, 
        password,
        avatar: {
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url,
        },
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
    
  } catch (error) {
    next(error)
  }
}

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email });

    const token=generateToken(user._id);

    const cookiesOption={
        maxAge:process.env.COOKIE_EXPIRE*24*60*60*1000,
        httpOnly:true,
    };

    if (user && (await user.matchPassword(password))){
      res.status(200).cookie('token',token,cookiesOption,).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token
      })

    } else {
      res.status(401)
      throw new Error('Wrong email or password')
    }
  } catch (error) {
    next(error)
  }
}

export const logoutUser=async(req,res)=>{
    try {
        return res.status(200).cookie('token',null,{maxAge:0}).json({
          message:"logout successfully!"
      })
    } catch (error) {
         console.log(error);
    }
}

export const deleteUser=async(req,res)=>{
try {
        const id=req.params.id;

        const user=await User.findById(id);

        if(!user)
            return res.status(400).json({
                message:"user not found!"
            })
        
        await user.deleteOne();

        return res.status(200).json({
            message:"user deleted successfully!"
        })

    } catch (error) {
        console.log(error);
    }
}

export const updateUser=async(req,res)=>{
    try {
    const{fullname,email}=req.body;
    const id=req.user._id;

    let newUser={};

    if(fullname)
        newUser.fullname=fullname;

    if(email)
        newUser.email=email;

    if(req.body.avatar!=="")
        {
            const user=await User.findById(req.user.id);
            const imageId=user.avatar.public_id;
            
            //delete previous profile pic
            await cloudinary.uploader.destroy(imageId);
            
            // Upload new pic to Cloudinary
            const uploadResult = await uploadOnCloudinary(req.file.path);
            
            newUser.avatar={
                public_id: uploadResult?.public_id,
                url: uploadResult?.secure_url,
            };
        }
    

    const user=await User.findByIdAndUpdate(id,newUser,{
        new:true,  
    })

    return res.status(200).json({
        message:"user updated successfully!"
    })
    } catch (error) {
    console.log(error)
    }
}   

export const getAllUsers=async(req,res)=>{
try {
    const allUser=await User.find();

    return res.status(200).json(allUser);
} catch (error) {
    console.log(error);
}
}

export const getSingleUser=async (req,res) => {
try {
    const id=req.params.id;

    const user=await User.findOne({_id:id});

    return res.status(200).json(user);
} catch (error) {
    console.log(error);
}
}