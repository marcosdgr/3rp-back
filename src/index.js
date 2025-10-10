import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";
import cors from "cors";
// import de rutas
import personasRoutes from "./routes/personas.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js"

// inicio dotenv para llamar las variables de entorno desde el archivo .env
dotenv.config();

// creao la conexion a la base de datos

db.connect((err) => {
  if (err) {
    console.error("Error de conexion a la base de datos: ", err);
    return;
  }
  console.log("Conexion a la DB exitosa");
});
// inicializo express
const app = express();

//configuro cors
app.use(cors());

// configuracion del puerto
const PORT = process.env.PORT || 3000;

// middlewares

app.use(express.json());

// rutas
     //personas
app.use("/api/personas/v1", personasRoutes);
    // usuarios
app.use ("/api/usuarios/v1",usuariosRoutes)

// inicializo el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
