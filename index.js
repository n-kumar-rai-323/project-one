require("dotenv").config()
const express = require("express"); 
const mongoose= require("mongoose")
const morgan = require("morgan");


const app = express();
const PORT = Number(process.env.PORT) || 7877
const indexRouter = require("./routes");

mongoose.connect(process.env.DB_URL).then(console.log("Database connected..")).catch((e)=>{console.log("Database Error")})
app.use(express.json());
app.use("/resources", express.static("public"));
app.use(morgan("tiny"));


app.use("/", indexRouter)


app.listen(PORT,()=>{
    console.log(`Application Running ${PORT}`)
})