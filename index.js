import connectDB from "./config/db.js"
import dotenv from "dotenv"
import app from "./app.js"
dotenv.config({
    path:'./.env'
})

connectDB()
  .then(()=>{
    app.on("error",(error)=>{
    console.log("Some Error Happened in ./src/index.js before listening to app");
    })
    app.listen(process.env.PORT||8080,()=>{
      console.log({
        serverStatus:"   Server is Running ", 
        URL:`http://localhost:${process.env.PORT}`
      });
    })
  })
  .catch((error)=>{
    console.log("DB connection Failed from Index.js");
  })