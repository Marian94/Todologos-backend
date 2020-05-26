const express = require("express"); //importar express
const app = express(); //inicializar una API
const port = 8000; //definir en qué puerto escucha el backend​
//express.json() checa si el content-type es application/json
//si sí, entonces lee todo el body y lo convierte en objeto normal
app.use(express.json()); //preparamos al server para cuando el body sea JSON
//definir un endpoint para todos los verbos y todas las rutas
app.all("*", (req, res) => {
    //OBJETO / JSON-------------------------------------------------------------
    const objeto_respuesta = {}; //construir el objeto de respuesta
    objeto_respuesta["querystring"] = req.query;
    objeto_respuesta["body"] = req.body;
    res.append("content-type", "application/json");
    res.status(200).json(objeto_respuesta); //enviar el response, su status y su mensaje
    //TEXTO PLANO---------------------------------------------------------------
    const cadena_respuesta = ""; //construir el mensaje de respuesta
    cadena_respuesta += "Enviaste el querystring: " + JSON.stringify(req.query);
    cadena_respuesta += "\n\n";
    cadena_respuesta += "Enviaste el body: " + JSON.stringify(req.body);
    res.status(200).send(cadena_respuesta); //enviar el response, su status y su mensaje
});
app.listen(port, () => {
    console.log("todo listo mi chavo..."); //iniciar el server
});