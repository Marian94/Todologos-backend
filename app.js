const express = require("express"); //importar express
const router = express.Router(); //crear un router
const app = express(); //crear una app de express (app = server = API)
const port = process.env.PORT || 8000; //definir el puerto
const password = process.env.PASS || "cloudmongo100";
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());
app.options("*", cors());


//iniciar el servidor
app.listen(port, () => {
    console.log(`Estoy escuchando el puerto ${port}...`);
});


//endpoint que escucha TODO

// app.all("*", (req, res) => {
//     console.log(req);
//     console.log("recibido");
//     res.status(200).json({"hola":"mundo"});
// });

//inicializar la db
let initMongo = async () =>{
    try{
        await mongoose.connect(
                //"mongodb://localhost:27017/servicios",
                `mongodb+srv://Marian94:${password}@clustermariana-zvwon.mongodb.net/servicios?retryWrites=true&w=majority`,{
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        console.log("Database connected");
    }catch (e){
        console.error("Database error", e.message)
    }
}

initMongo();
app.post("/signup", (req, res) =>{
    res.status(200).json({result: "todo bien"});
});
//app.post("/signup", signupHandler);