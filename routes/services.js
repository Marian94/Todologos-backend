const express = require("express"); //importar express
const router = express.Router(); //crear un router
const { addServices, getServices, updateServices } = require("../controller/services")

//Add Services for the first time
router.post("/",  async (req, res) =>{
    try{
       const data = await addServices(req, res);
        res.status(200).json({ "result": data });
    }catch(e){
        res.status(500).json({ "result": "error", "message": e });
    }
});
//Get Services for the db
router.get("/", async (req, res) =>{
    try{
       const data = await getServices();
        res.status(200).json({ "result": data.services.services });
    }catch(e){
        res.status(500).json({ "result": "error", "message": e });
    }
});
router.patch("/",  async (req, res) =>{
    try{
        const data = await updateServices(req, res);
         res.status(200).json({ "result": data });
    }catch(e){
        res.status(500).json({ "result": "error", "message": e });
    }
});

module.exports = router;