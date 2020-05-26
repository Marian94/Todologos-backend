const express = require("express"); //importar express
const router = express.Router(); //crear un router
const places = require("../dummydata/places_dummy");
//todo lo que llegue a este lugar
//tiene /api/places al principio
//pero sólo colocaremos rutas de ahí en adelante
router.get("/renta/:idPropiedad", (req, res) => {
    try {
        const id = Number(req.params.idPropiedad);
        const encontrado = places[id];
        const disponible = !(encontrado.rentada);
        res.status(200).send(`La propiedad ${disponible ? "sí" : "no"} está disponible.`);
    }catch(err) {
        res.status(400).send("Mándalo bien, WEY");
    }
});
//endpoint que escucha todo lo que empiece con /api/places
router.all("*", (req, res) => {
    const payload = req.body;
    res.status(200).send("Sí jaló el router weyyyyy!!! y enviaste esto: "+JSON.stringify(payload));
});
module.exports = router;