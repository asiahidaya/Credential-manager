import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

function encrypt(password) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY,"hex");
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    const encrypted = cipher.update(password, "utf8", "hex") + cipher.final("hex");
    const authTag = cipher.getAuthTag();
    return ({encrypted:encrypted, iv:iv.toString("hex"), authTag:authTag.toString("hex")});
}

function decrypt(encrypted, iv, authTag) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY,"hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm",key,Buffer.from(iv,"hex"));
    decipher.setAuthTag(Buffer.from(authTag,"hex"));
    const decrypted = decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
    return (decrypted);
}

export {encrypt, decrypt};