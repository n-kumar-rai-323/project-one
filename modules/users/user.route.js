const multer = require("multer");
const router = require('express').Router();
const Controller = require("./user.controller");


const storage = multer.diskStorage({
    destination : function(req, file,cb){
        cb(null, "public/uploads")
    },
    filename: function(req,file,cb){
        cb(null, Date.now() +"." + file.originalname.split(".")[1]);
    }
});
const upload = multer({storage});

router.post("/register",upload.single("image"), async (req, res, next) => {
    try {
        if(req.file){
            req.body.image = req.file.filename;
        }
        const result = await Controller.register(req.body);
        res.json(result)
    } catch (e) {
        next(e)
    }
});

module.exports = router;