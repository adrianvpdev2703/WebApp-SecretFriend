const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./src/models");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mainRouter = require("./src/routes");
app.use("/api", mainRouter);

app.get("/", (req, res) => {
    res.send("La API de amigo secreto ta funcando waso xd");
});

const startServer = async () => {
    try {
        await sequelize.sync();
        console.log("Modelos sincronizados con la base de datos.");

        app.listen(port, () => {
            console.log(`Servidor escuchando en http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
        console.error("No se pudo conectar/sincronizar la base de datos.");
    }
};

startServer();
