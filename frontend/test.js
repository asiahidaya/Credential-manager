import crypto from "crypto";

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(12);

const cipher = crypto.createCipheriv("aes-256-gcm",key,iv);
let encrypted = cipher.update("gmail-password-123","utf8","hex");
encrypted += cipher.final("hex");
const authTag = cipher.getAuthTag();

const decipher = crypto.createDecipheriv("aes-256-gcm","utf8","hex");
let decrypted = decipher.update(encrypted,"hex","utf-8");
decrypted += decipher.final("utf8");



import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config()

function encrypt(password) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-gcm",key,iv);
    const encrypted = cipher.update(password,"utf8","hex") + cipher.final("hex");
    const authTag = cipher.getAuthTag();
    return {encrypted, iv: iv.toString("hex"), authTag:authTag.toString("hex")};
}

function decrypt(encrypted, iv, authTag) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(iv, "hex"));
    decipher.setAuthTag(Buffer.from(authTag, "hex"));
    const decrypted = Buffer.concat ([decipher.update(Buffer.from(encrypted,"hex")) , decipher.final()]);
    return decrypted.toString("utf8");
}

export {encrypt,decrypt};

import { createContext } from "react";

const UserContext = createContext();

export default UserContext;

//provide data
//<UserContext.Provider value="Asia">
//    <Header />
//    <Profile />

//</UserContext.Provider>

// consume data
import { useContext } from "react";
import UserContext from "./UserContext";

function Profile() {

    const username = useContext(UserContext);

    return <h1>Hello {username}</h1>;
}