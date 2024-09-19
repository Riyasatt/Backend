import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import StudentAuthRoutes from "./routes/StudentAuthRoutes.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(
    cors({
        origin : [process.env.ORIGIN],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true
    })
)

app.use("/uploads/", express.static("uploads/"))


app.use(cookieParser())
app.use(express.json());

app.use('/api/auth', StudentAuthRoutes);

const server = app.listen(port,() =>{
    console.log("Server is running on port http://localhost:" + port);
})


