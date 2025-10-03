import mysql from "mysql2";
import dotenv from "dotenv";

// se inicializa dotenv para cargar las variables de entorno desde el archivo .env
dotenv.config();

// creo conexion a la base de datos usando las variables de entorno

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});


export default conexion;
