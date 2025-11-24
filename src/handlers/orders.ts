import express, { Request, Response } from "express";
import { OrderModel } from "../models/order";
import { verifyAuthToken } from "../middleware/auth";

const orderModel = new OrderModel();

const create = async(req: Request, res: Response) => {
    try {
        const userid = parseInt(req.params.userid);
        if(isNaN(userid))
        {
            return res.status(400).json({error: "userid is required"});
        }
        const order  = await orderModel.create(userid);
        res.status(201).json({result:"Order created successfully",order});
    } catch (error) {
        res.status(500).json({error:"Failed to create order"})
    }
}
const addProducts = async(req: Request, res: Response) => {
    try {
        const quantity = parseInt(req.body.quantity);
        const orderid = parseInt(req.params.orderid);
        const productid = parseInt(req.body.productid);
        if(isNaN(quantity) || quantity <= 0 || isNaN(orderid) || isNaN(productid))
        {
            return res.status(400).json({error: "quantity, orderid, and productid must be valid numbers"});
        }
        const productAdded  = await orderModel.addProduct(quantity, orderid, productid);
        return res.status(201).json({result:"Product added successfully",productAdded});
    } catch (error) {
        return res.status(500).json({error:"Failed to add product"})
    }
}
const currentByUser = async(req: Request, res: Response) => {
    try {
        const userid = parseInt(req.params.userid);
        if(isNaN(userid))
        {
            return res.status(400).json({error: "userid is required"});
        }
        const currentOrder = await orderModel.currentByUser(userid);
        if (!currentOrder)
        {
            return res.status(404).json({error:"No active orders"});
        }
        return res.status(200).json(currentOrder);
    } catch (error) {
        return res.status(500).json({error: "Failed to retrieve last user order"});
    }
}
export default function orderRoutes(app: express.Application){
    app.post('/orders/:userid',verifyAuthToken,create);
    app.post('/orders/:orderid/products',verifyAuthToken,addProducts);
    app.get('/orders/current/:userid',verifyAuthToken,currentByUser);
}
