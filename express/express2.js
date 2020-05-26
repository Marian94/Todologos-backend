const express = require("express"); //importar express
const app = express(); //crear una app de express (app = server = API)
const port = process.env.PORT || 8001; //definir el puerto
app.use(express.json()); //para que esta API pueda recibir payloads en JSON
const placesRouter = require("./routes/places"); //importar la ruta /places
//todo lo que llegue a /api/places se va a otro archivo
app.use("/api/places", placesRouter);
//endpoint que escucha TODO
app.all("*", (req, res) => {
    res.status(200).send("Sí jala esta madreeeeeee!!!");
});
//iniciar el servidor
app.listen(port, () => {
    console.log(`Estoy escuchando el puerto ${port}...`);
});