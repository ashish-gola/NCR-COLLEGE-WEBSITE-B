import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import userRouter from "./routes/user.router.js"
import eventRoutes from "./routes/event.route.js"
import noticeRoutes from "./routes/notice.route.js"
import studentRoutes from "./routes/student.route.js"
import uploadRoutes from "./routes/upload.routes.js"
import galleryRoutes from "./routes/gallery.route.js"

const app = express();
dotenv.config();

const clientUrl= process.env.CLIENT_URL;

app.use(cors({
    origin: clientUrl,
    credentials:true
}))
app.use(express.json({}))
app.use(express.urlencoded({extended:true,}))
app.use(express.static("public"))
app.use(cookieParser())

// app.get("/",(req,res)=>{
//     res.send("hello the server started");
// });
app.use(uploadRoutes);
app.use("/",userRouter);
app.use("/events",eventRoutes);
app.use("/notices",noticeRoutes);
app.use("/students",studentRoutes);
app.use("/gallery",galleryRoutes);


export default app