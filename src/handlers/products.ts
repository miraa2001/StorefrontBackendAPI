import express, { Request, Response } from "express";
import { ProductModel } from "../models/product";
import { verifyAuthToken } from "../middleware/auth";

const productModel = new ProductModel();

const index = async(req: Request,res: Response) => {
    try {
        const products = await productModel.index();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products"});
    }
};
const show = async(req: Request,res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const product = await productModel.show(id);
        if(!product)
        {
            return res.status(404).json({error:"Product not found"});
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch product"});
    }
};
const create =  async(req: Request,res: Response) => {
    try {
        const name = req.body.name as string;
        const price = parseInt(req.body.price);
        const category = req.body.category as string;
        if(!name || isNaN(price))
        {
            return res.status(400).json({error: "name or price are missing"});
        }
        const product = await productModel.create({name,price,category});
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({error:"Failed to create product"});
    }
};
export default function productsRoutes(app: express.Application){
    app.get('/products',index);
    app.get('/products/:id',show);
    app.post('/products',verifyAuthToken,create);
}
