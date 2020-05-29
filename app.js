const express = require("express"); //importar express
const cors = require("cors");
const mongoose = require("mongoose");

const app = express(); //crear una app de express (app = server = API)
const port = process.env.PORT || 8000; //definir el puerto
const password = process.env.PASS || "cloudmongo100";
const userController = require("./routes/user");
const servicesController = require("./routes/services");


app.use(cors());
app.use(express.json());
app.options("*", cors());


//iniciar el servidor
app.listen(port, () => {
    console.log(`Estoy escuchando el puerto ${port}...`);
});
//inicializar la db
let initMongo = async () =>{
    try{
        await mongoose.connect(
                //"mongodb://localhost:27017/servicios",{
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

app.use("/user", userController);
app.use("/services", servicesController);
app.use("/uploads", express.static("uploads"));