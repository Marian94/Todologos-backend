
const mongoose = require("mongoose");

const userSchema =  mongoose.Schema({
    "_id": mongoose.Schema.Types.ObjectId,
    "firstName": String,
    "lastName": String,
    "email": String,
    "celular": Number,
    "telefono": Number,
    "password": String,
    "address1": String,
    "colonia": String,
    "municipio": String,
    "postalCode": String,
    "checkboxGroup": Array,
    "description": String,
    "admin": Boolean,
    "active": Boolean 
});
const userModel = mongoose.model("servicios", userSchema);
module.exports = userModel;