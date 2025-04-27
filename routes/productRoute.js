import express from 'express';
import { getAllProducts } from '../controllers/productsController.js';

const productRouter=express.Router();


productRouter.get('/all',getAllProducts);

export {productRouter};