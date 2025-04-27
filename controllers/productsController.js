import { Product } from "../models/productModel.js";
import { ApiFeature } from "../utils/ApiFeatures.js";

export const getAllProducts=async(req,res)=>{

    const searchKeyword=req.query;
    const productCount=await Product.countDocuments();

    const resultPerPage=6;

    const apifeature=new ApiFeature(Product.find(),searchKeyword).search().filter().pagination(resultPerPage);

    const products=await apifeature.query;

    if(!products)
        throw new ApiError(500,"Products Not Found!!!");

    return res.status(200).json({message:"proudct fatched successfully!",products});
};