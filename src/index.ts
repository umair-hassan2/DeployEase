import express from "express"
import dotenv from "dotenv"
import cors from "cors"

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cors())

app.get("/" , (req , res)=>{
    res.json({"message" :"server is running"})
});

app.listen(3000 , ()=>{
    console.log("Server is running on port 3000");
})