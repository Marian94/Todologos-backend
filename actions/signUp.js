
const User = require('../models/signUp');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

async function findDupUser(email) {   ​
    const userfound = {};
    try {
        userfound["user"] = await User.findOne({ "email": email });
        if(!userfound["user"]) {
            userfound["success"] = true;
            console.log("El email es válido.");
        } else {
            userfound["user"] = `Un usuario con el email ${email} ya existe.`;
            userfound["success"] = false;
            console.log(userfound["user"]);
        }
    }catch (err) {
        userfound["user"] = "Signup failed";
        userfound["success"] = false;
        console.error(err.stack);
        //console.error("Algo tronó al validar el email...");
    }
    return userfound;
}
​
async function hashAndSalt(pass) {
    const hashedpass = {};
    try {
        hashedpass["pass"] = await bcrypt.hash(pass, saltRounds);
        hashedpass["success"] = true;
        console.log("Contraseña hasheada exitosamente.");
    }catch(err) {
        hashedpass["pass"] = "Signup failed";
        hashedpass["success"] = false;
        console.error(err.stack);
        //console.error("Algo tronó al hashear la contraseña...");
    }
    return hashedpass;
}
async function postNewUser(req, pass) {
    const postresult = {};
    const user = new User({
        "_id": mongoose.Schema.Types.ObjectId,
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "celular": req.body.celular,
        "telefono": req.body.telefono,
        "password": pass,
        "address1": req.body.address1,
        "colonia": req.body.colonia,
        "municipio": req.body.municipio,
        "postalCode": req.body.postalCode,
        "checkboxGroup": req.body.checkboxGroup,
        "description": req.body.description,
        "admin": req.body.admin,
        "active": req.body.active 
    });
    try {
        postresult["result"] = await user.save();
        postresult["success"] = true;
        console.log(postresult["result"]);
    }catch(err) {
        postresult["result"] = "Signup failed";
        postresult["success"] = false;
        console.error(err.stack);
        //console.error("Algo tronó al insertar el usuario...");
    }
    return postresult;
}
async function signupHandler(req, res) {
    //Validar si un usuario con el mismo email no existe ya
    const valid_email = await findDupUser(req.body.email);
    if(!valid_email.success) {
        res.status(409).json({ "error": valid_email.user });
        return;
    }
    //Hashear y salar la contraseña
    const securePass = await hashAndSalt(req.body.pass);
    if(!securePass.success) {
        res.status(409).json({ "error": securePass.pass });
        return;
    }
    //Guardar el usuario en la DB
    const postResult = await postNewUser(req, securePass.pass);
    if(!postResult.success) {
        res.status(409).json({ "error": postResult.result });
        return;
    }
    //Sólo si todo lo anterior salió bien, llegamos aquí.
    console.log("Nuevo usuario guardado.");
    res.status(201).json({ "result": "POST OK." });
    return;
}