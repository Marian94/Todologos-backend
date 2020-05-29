const express = require("express"); //importar express
const router = express.Router(); //crear un router
const multer = require("multer");
const path = require("path");
const { createUser, createCatalog, loginToken, modifyProfile, deleteUser} = require("../controller/user")

//MULTER FUNCTIONS
const storage = multer.diskStorage({
    "destination": function(req, file, cb) {
        cb(null, path.join(__dirname,"..","uploads"));
    },
    "filename": function(req, file, cb) {
        const timestamp = new Date().toISOString().replace(/:/g,'-');
        cb(null, timestamp +"_"+ file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype.slice(0, 5) === "image") {
        //console.log("¡Recibí una imagen!");
        cb(null, true);
    }else {
        //console.log("Recibí uno de estos: "+file.mimetype);
        cb(null, false);
    }
};
const upload = multer({
    "storage"    : storage,
    "fileFilter" : fileFilter,
    "limits"     : {"fileSize": 5 * 1024 * 1024} //5 MB
});

//CREATE NEW USER
router.post("/", upload.single("file"), async (req, res) =>{
    req.body.image = path.basename(req.file.path);
    try{
        const data = await createUser(req, res);
         res.status(200).json({ "result": data });
     }catch(e){
         console.log(e.message);
        res.status(500).json({ "result": "error", "message": e.message });
     }
});

//CREATE CATALOG
router.get("/catalog", async (req, res) =>{
    try{
        const admin = false;
        const data = await createCatalog(admin);
        res.status(200).json({ "result": data.catalog });
    }catch(e){
        console.log(e.message);
        res.status(500).json({ "result": "error", "message": e });
    }
});
router.get("/catalog/admin", async (req, res) =>{
    try{
        const admin = true;
       const data = await createCatalog(admin);
        res.status(200).json({ "result": data });
    }catch(e){
        console.log(e.message);
        res.status(500).json({ "result": "error", "message": e });
    }
});

//TOKEN PASSWORD
router.post("/login", async(req,res) => {
    try{
        const data = await loginToken(req, res);
        res.status(200).json({ "result": data });
     }catch(e){
         console.log(e.message);
        res.status(500).json({ "result": "error", "message": e.message });
     }
});

//MODIFY USER
router.patch("/profile", upload.single("file"), async (req, res) =>{
    req.body.image = (req.file)? path.basename(req.file.path): false;
    try{
        const data = await modifyProfile(req, res);
         res.status(200).json({ "result": data });
     }catch(e){
         console.log(e.message);
        res.status(500).json({ "result": "error", "message": e.message });
     }
});
//DELETE USER
router.delete("/delete/:id", async (req,res) =>{
    try{
         const data = await deleteUser(req.params.id, res);
         res.status(200).json({ "result": data });
     }catch(e){
         console.log(e);
        res.status(500).json({ "result": "error", "message": e });
     }
})


module.exports = router;