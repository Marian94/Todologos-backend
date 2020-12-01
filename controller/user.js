const User = require('../model/user');
const Service = require('../model/services');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtKey  = process.env.jwtKey  || "cloudjwtKey";


//ADD NEW USER
async function findDupUser(email) {
    const userfound = {};
    try {
        userfound["user"] = await User.findOne({ "email": email });
        if(!userfound["user"]) {
            userfound["success"] = true;
            console.log("El email es válido.");
        } else {
            userfound["message"] = `Un usuario con el email ${email} ya existe.`;
            userfound["success"] = false;
            console.log(userfound["message"]);
        }
    }catch (err) {
        userfound["user"] = "Signup failed";
        userfound["success"] = false;
        console.error(err.stack);
        console.error("Algo tronó al validar el email...");
    }
    return userfound;
}
async function hashAndSalt(pass, saltRounds) {
    const hashedpass = {};
    try {
        hashedpass["pass"] = await bcrypt.hash(pass, saltRounds);
        hashedpass["success"] = true;
        console.log("Contraseña hasheada exitosamente.");
    }catch(err) {
        hashedpass["pass"] = "Signup failed";
        hashedpass["success"] = false;
        console.error(err.stack);
        console.error("Algo tronó al hashear la contraseña...");
    }
    return hashedpass;
}
async function postNewUser(req, pass) {
    const postresult = {};
    const checkboxGroup=(req.body.checkboxGroup)? req.body.checkboxGroup.split(',') : [];
    const schedule=(req.body.schedule)? JSON.parse(req.body.schedule) : [];
    const payMethod=(req.body.payMethod)? JSON.parse(req.body.payMethod) : [];
    const specialServices= (req.body.specialServices)? JSON.parse(req.body.specialServices) : [];
    const telefono= (req.body.telefono)? req.body.telefono : "";
    const user = new User({
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        //"email": req.body.email,
        "celular": req.body.celular,
        "telefono": telefono,
        //"password": pass,
        "address1": req.body.address1,
        "colonia": req.body.colonia,
        "municipio": req.body.municipio,
        //"postalCode": req.body.postalCode,
        "checkboxGroup": checkboxGroup,
        "schedule": schedule,
        "payMethod": payMethod,
        "specialServices": specialServices,
        "description": req.body.description,
        "admin": req.body.admin,
        "active": req.body.active,
        "job": req.body.job,
        "image": req.body.image
    });
    try {
        postresult["result"] = await user.save();
        postresult["success"] = true;
        console.log(postresult["result"]);
    }catch(err) {
        postresult["result"] = "Signup failed";
        postresult["success"] = false;
        console.error(err.stack);
        console.error("Algo tronó al insertar el usuario...");
    }
    return postresult;
}
async function createUser(req, res) {
    //Validar si un usuario con el mismo email no existe ya
    // const valid_email = await findDupUser(req.body.email);
    // if(!valid_email.success) {
    //     throw new Error(valid_email.message);
    // }
    // //Hashear y salar la contraseña
    // const saltRounds = 10;
    // const securePass = await hashAndSalt(req.body.password, saltRounds);
    // if(!securePass.success) {
    //     throw new Error(securePass) ;
    // }
    // //Guardar el usuario en la DB
    const postResult = await postNewUser(req, "");
    if(!postResult.success) {
        throw new Error(postResult);
    }
    //Sólo si todo lo anterior salió bien, llegamos aquí.
    console.log("Nuevo usuario guardado.");
    return postResult;
}

//CREATE CATALOG
async function createCatalog(admin){

    const catalogResult = {};
    try {
        if(admin){
            const users = await User.find();
            if(users.length > 0){
                catalogResult["catalog"] = users;
                catalogResult["success"] = true;
                console.log("Catalogo admin creado");
                return catalogResult;
            } else {
                catalogResult["message"] = `Catalogo no encontrado`;
                catalogResult["success"] = false;
                return catalogResult;
            }
        }else{
            //simple
            const data= await Service.findOne({ "keyName": "Servicios" });
            //multiple
            const usefulData = await User.find({ job: true, active: true  });
            if(usefulData.length > 0) {
                //Create the object
                var hash = {};
                data.services.forEach(service => {
                if (!hash[service]) {
                    hash[service] = [];
                }
                });
                usefulData.forEach(worker => {
                    worker.checkboxGroup.forEach(service => {
                        if (hash[service]) {
                            hash[service].push(worker);
                        }
                    });
                });
                catalogResult["catalog"] = hash;
                catalogResult["success"] = true;
                console.log("Catalogo creado");
                return catalogResult;
            } else {
                catalogResult["message"] = `Catalogo no encontrado`;
                catalogResult["success"] = false;
                return catalogResult;
            }
        }
        
    }catch (err) {
        console.error(err.stack);
    }    
}

//LOGIN TOKEN
async function loginToken(req, res){
    const loginResult = {};
    //Validar si el email existe
    const valid_email = await findDupUser(req.body.email);
    if(valid_email.success) {
        throw new Error("No hay usuarios con ese email.");
    }

    const result = await bcrypt.compare(req.body.password, valid_email.user.password);
    if(result){
        const jwtPayload = {
            "email": valid_email.user.email,
            "id": valid_email.user._id
        }
        const jwtConfig = { "expiresIn": "1h" };
        const token = await jwt.sign(jwtPayload, jwtKey, jwtConfig);
        if(token){
                loginResult["token"]=token;
                loginResult["user"]=valid_email.user;
                loginResult["message"]="Login exitoso";
                loginResult["success"] = true;
                return loginResult;
        }else{
            throw new Error("Problemas de autenticacion.");     
        }
    }else {
        throw new Error("Contraseña incorrecta.");
    }
}

//MODIFY USER
async function modifyProfile(req,res){
    const updateProfile = {};
    try {
        const checkboxGroup=(req.body.checkboxGroup)? req.body.checkboxGroup.split(',') : [];
        const schedule=(req.body.schedule)? JSON.parse(req.body.schedule) : [];
        const payMethod=(req.body.payMethod)? JSON.parse(req.body.payMethod) : [];
        const specialServices= (req.body.specialServices)? JSON.parse(req.body.specialServices) : [];
        const telefono= (req.body.telefono !== "")? req.body.telefono : "";
        const changes = {
            celular : req.body.celular,
            telefono: telefono,
            address1: req.body.address1,
            colonia: req.body.colonia,
            municipio: req.body.municipio,
            postalCode: req.body.postalCode,
            active: req.body.active,
            description: req.body.description,
            specialServices: specialServices,
            payMethod: payMethod,
            schedule: schedule,
            checkboxGroup:checkboxGroup,
        };
        if(req.body.image){
            changes.image=req.body.image;
        }
        const updateSuccess = await User.updateOne( { _id: req.body.id }, { $set: changes });
        const userUpdate= await User.findOne({ _id: req.body.id });
        if(updateSuccess) {
            updateProfile["updated"] = userUpdate;
            updateProfile["success"] = true;
            updateProfile["message"] = "Datos guardados.";
            return updateProfile;
        } else {
            updateProfile["message"] = `Catalogo no encontrado`;
            updateProfile["success"] = false;
            throw new Error("Catalogo no encontrado.");    
        }
    }catch (err) {
        console.error(err.stack);
    }    
}

//DELETE USER
async function deleteUser(id,res){
    const deleteUser = {};
    try{
        const idDelete = await User.deleteOne( { _id: id } );
        const users = await User.find();
        if(users.length > 0){
            deleteUser["catalogAdmin"] = users;
            deleteUser["success"] = true;
            console.log("Usuario eliminado");
            return deleteUser;
        } else {
            deleteUser["message"] = `No hay mas usuarios que eliminar`;
            deleteUser["success"] = false;
            throw new Error("No hay mas usuarios que eliminar.");    
        }
    }catch (err) {
        console.error(err.stack);
    }  
}

// Export it to make it available outside
module.exports = {
    createUser,
    createCatalog,
    loginToken,
    modifyProfile,
    deleteUser
};