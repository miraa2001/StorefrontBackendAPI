import client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export type User = {
  id?: number;
  firstname: string;
  lastname: string;
  password?: string;
};

export class UserModel {
  async index(): Promise<User[]> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT id, firstname, lastname FROM users';
      const result = await conn.query(sql);
      return result.rows;
    } finally {
      conn.release();
    }
  }

  async show(id: number): Promise<User | undefined> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT id, firstname, lastname FROM users WHERE id=$1';
      const result = await conn.query(sql, [id]);
      return result.rows[0];
    } finally{
      conn.release();
    }
  }

  async create(u: User): Promise<User> {
    const conn = await client.connect();

    try {
      const hash = bcrypt.hashSync(
        (u.password as string) + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS as string)
      );
  
      const sql = `
        INSERT INTO users (firstname, lastname, password)
        VALUES ($1, $2, $3)
        RETURNING id, firstname, lastname
      `;
  
      const result = await conn.query(sql, [u.firstname, u.lastname, hash]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async authenticate(firstname: string, password: string): Promise<User | null> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT * FROM users WHERE firstname=$1';
      const result = await conn.query(sql, [firstname]);
  
      if (!result.rows.length) {
        return null;
      }
  
      const user = result.rows[0];
      const valid = bcrypt.compareSync(
        password + BCRYPT_PASSWORD,
        user.password
      );
  
  
      if (!valid) return null;
  
      return {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname
      };
    } finally {
      conn.release();
    }
  }
}
