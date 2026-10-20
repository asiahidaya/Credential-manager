import express from "express";
const app = express();

import users from "./routes/users.js";
import credentials from "./routes/credentials.js"; 
import admins from "./routes/admin.js";
import cors from 'cors';
import { adminMiddleware, authMiddleware } from "./middleware.js";


app.use(express.json());
app.use(cors());

app.use("/users",users);
app.use("/credentials",credentials);
app.use("/admin", authMiddleware, adminMiddleware, admins);



app.listen(8000 ,() => {
    console.log("Server started at port 8000");
});