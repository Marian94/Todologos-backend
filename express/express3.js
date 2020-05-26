const express = require("express");
const multer = require("multer");
const cors = require("cors");
const app = express(); //crear una app de express (app = server = API)
const port = process.env.PORT || 8001; //definir el puerto​
app.options("*", cors());
app.use(cors());
const storage = multer.diskStorage({
    "destination": function(req, file, cb) {
        console.log("setting upload folder...");
        cb(null, "./uploads");
    },
    "filename": function(req, file, cb) {
        console.log("fieldname: "+file.fieldname);
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype.slice(0, 5) === "image") {
        console.log("¡Recibí una imagen!");
        cb(null, true);
    }else {
        console.log("Recibí uno de estos: "+file.mimetype);
        cb(null, false);
    }
};
const upload = multer({
    "storage"    : storage,
    "fileFilter" : fileFilter,
    "limits"     : {"fileSize": 5 * 1024 * 1024} //5 MB
});
app.post("/images", upload.single("uploadedImage"), (req, res) => {
    try {
        console.log("Acaba de llegar: " + req.file.path);
        console.log("Texto adjunto: " + JSON.stringify(req.body));
        const objres = {
            "file" : req.file.path,
            "body" : req.body
        };
        res.status(200).json(objres);
    }catch(err) {
        res.status(400).json({"error":err.stack});
    }
});
//endpoint que escucha TODO
app.all("*", (req, res) => {
    console.log("recibido");
    res.status(200).json({"hola":"mundo"});
});
//iniciar el servidor
app.listen(port, () => {
    console.log(`Estoy escuchando el puerto ${port}...`);
});
