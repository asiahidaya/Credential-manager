import express from "express";
import cors from "cors";

import users from "./routes/users.js";
import credentials from "./routes/credentials.js";
import admins from "./routes/admin.js";

import { adminMiddleware, authMiddleware } from "./middleware.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", users);
app.use("/credentials", credentials);
app.use("/admin", authMiddleware, adminMiddleware, admins);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});