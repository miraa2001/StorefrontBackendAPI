import client from '../database';
export type Order = {
    id?: number;
    userid: number;
    status: string;
};
export type OrderProduct = {
    id?: number;
    quantity: number;
    productid: number;
    orderid: number;
}
export type OrderShape = {
  id?: number;
  userid: number;
  status: string;
  products?: { productid: number; 
                name: string; 
                quantity: number
             }[];
};
export class OrderModel{
    async create(userid: number): Promise<Order>{
        const conn = await client.connect();
        try{
            const sql = 'INSERT INTO orders(userid,status) VALUES($1,\'active\') RETURNING *';
            const result = await conn.query(sql,[userid]);
            return result.rows[0];
        }finally{
            conn.release();
        }
    }
    async addProduct(quantity: number, orderid: number, productid: number): Promise<OrderProduct>{
        const conn = await client.connect();
        try{
            const sql = 'INSERT INTO order_products(quantity, orderid, productid) VALUES ($1,$2,$3) RETURNING *';
            const result = await conn.query(sql,[quantity,orderid,productid]);
            return result.rows[0];
        }finally{
            conn.release();
        }
    }
    async currentByUser(userid: number): Promise<OrderShape | undefined>{
        const conn = await client.connect();
        try{
            const sqlOrder = 'SELECT id, userid, status FROM orders WHERE userid=$1 AND status=\'active\' ORDER BY id DESC LIMIT 1';
            const orderResult = await conn.query(sqlOrder,[userid]);
            if(orderResult.rows.length === 0)
                return;
            const order = orderResult.rows[0] as Order;
            const sqlProducts = 'SELECT op.quantity AS quantity, p.id AS productid, p.name AS name FROM order_products op JOIN products p ON p.id = op.productid WHERE op.orderid = $1';
            const productsResult = await conn.query(sqlProducts,[order.id]);
            const products  = productsResult.rows as {
                productid: number;
                name: string,
                quantity: number;
            }[];
            const orderShape: OrderShape = {
                id: order.id,
                userid: order.userid,
                status: order.status,
                products
                };
            return orderShape;
        }finally{
            conn.release();
        }
    }
}