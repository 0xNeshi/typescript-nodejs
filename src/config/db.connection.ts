import dotenv from "dotenv";
import { createPool } from "mysql";

dotenv.config();

const pool = createPool({
	host: process.env.HOST,
	user: process.env.DB_USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	connectionLimit: 10,
	multipleStatements: true,
});

export default pool;
