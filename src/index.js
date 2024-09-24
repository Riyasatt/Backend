import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import StudentAuthRoutes from "./routes/StudentAuthRoutes.js";
import SAG_BureauAuthRoutes from "./routes/SAG_BureauAuthRoutes.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(
    cors({
        origin : [process.env.ORIGIN, process.env.ORIGIN2],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true
    })
)



app.use(cookieParser())
app.use(express.json());

//for student page
app.use('/api/auth', StudentAuthRoutes);

// for Sag_Bureau
app.use('/api/sag/auth', SAG_BureauAuthRoutes);

const server = app.listen(port,() =>{
    console.log("Server is running on port http://localhost:" + port);
})


