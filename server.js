import express from "express";
import dotenv from "dotenv";
import bruxosRoutes from "./src/routes/bruxosRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

const serverPort = process.env.PORT || 3001;

app.get("/", (req,res)  => {
    res.send("Servidor Funcionando 🪄🧙");
});

app.use("/bruxos", bruxosRoutes);


app.listen(serverPort, () => {
    console.log(`Servidor Funcionando em http://localhost:${serverPort} 🪄`)
});