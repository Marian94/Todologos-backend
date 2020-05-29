
const mongoose = require("mongoose");

const userSchema =  mongoose.Schema({
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
    "schedule": Array,
    "payMethod": Array,
    "specialServices": Array,
    "description": String,
    "admin": Boolean,
    "active": Boolean,
    "job": Boolean,
    "image": String
});
const userModel = mongoose.model("profesionistas", userSchema);
module.exports = userModel;