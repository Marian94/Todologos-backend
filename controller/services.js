const Service = require('../model/services');

async function addServices(req, res) {
    console.log(req.body);
    const postresult = {};
    const service = new Service({
        "keyName": "Servicios",
        "services": req.body.services
    });
    try {
        postresult["result"] = await service.save();
        postresult["success"] = true;
        console.log(postresult["result"]);
        console.log("Add Services.");
        return postresult;
    }catch(err) {
        postresult["success"] = false;
        console.error(err.stack);
    }
}
async function getServices() {
    const servicesFound = {};
    try {
        servicesFound["services"] = await Service.findOne({ "keyName": "Servicios" });
        if(servicesFound["services"]) {
            servicesFound["success"] = true;
            console.log("Documento encontrado");
            return servicesFound;
        } else {
            servicesFound["message"] = `Documento no encontrado`;
            servicesFound["success"] = false;
            return servicesFound;
        }
    }catch (err) {
        console.error(err.stack);
    }
}
async function updateServices(req,res){
    const updateServices = {};
    try {
        const changes={
            services:req.body
        }
        const updatServices = await Service.updateOne( { "keyName": "Servicios" }, { $set: changes });
        const services= await Service.findOne({ "keyName": "Servicios" });
        if(updatServices) {
            updateServices["updated"] = services;
            updateServices["success"] = true;
            updateServices["message"] = "Datos guardados.";
            return updateServices;
        } else {
            updateServices["message"] = `Catalogo no encontrado`;
            updateServices["success"] = false;
            throw new Error("Catalogo no encontrado.");    
        }
    }catch (err) {
        console.error(err.stack);
    }
}

// Export it to make it available outside
module.exports = {
    addServices,
    getServices,
    updateServices
};