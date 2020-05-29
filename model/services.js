
const mongoose = require("mongoose");

const serviceSchema =  mongoose.Schema({
    "keyName": {type: String, unique:true},
    "services": Array, 
});
const serviceModel = mongoose.model("servicios", serviceSchema);
module.exports = serviceModel;