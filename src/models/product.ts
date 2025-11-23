import client from '../database';

export type Product = {
    id?: number;
    name: string;
    price: number;
    category?: string;
};
export class ProductModel{
    async index(): Promise<Product[]>{
        const conn = await client.connect();
        try {
            const sql='SELECT id, name, price, category FROM products';
            const result = await conn.query(sql);
            return result.rows;
        } finally {
            conn.release();
        }
    }
    async show(id: number): Promise<Product | undefined>{
        const conn = await client.connect();
        try {
            const sql = 'SELECT id, name, price, category FROM products WHERE id=$1';
            const result = await conn.query(sql,[id]);
            return result.rows[0];
        } finally {
            conn.release();
        }
    }
    async create(p: Product): Promise<Product>{
        const conn = await client.connect();
        try{
            const sql = 'INSERT INTO products (name,price,category) VALUES($1,$2,$3) RETURNING *';
            const result = await conn.query(sql,[p.name,p.price,p.category??null]);
            return result.rows[0];
        }finally{
            conn.release();
        }
    }
};
