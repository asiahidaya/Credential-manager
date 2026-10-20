import express from "express";
import db from '../db.js';
import {authMiddleware} from "../middleware.js";
import { body, validationResult } from 'express-validator';
import { encrypt, decrypt } from "../encryption.js";

const router = express.Router();

router.get('/profile' , authMiddleware, async (req,res) => {
    try {
        const [credentials] = await db.query( "SELECT credential_id, user_id, account_username, account_password, website FROM credentials WHERE user_id = ?",[req.user.userId]);
        const decryptedCredentials = credentials.map((credential) => {
            const data = JSON.parse(credential.account_password);
            const decryptedPassword = decrypt(data.encrypted, data.iv, data.authTag);
            return {
                ...credential,
                account_password: decryptedPassword
            };
        });
            return res.status(200).json({
            message: "Welcome",
            userName: req.user.userName,
            credentials: decryptedCredentials
        });
    }  catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Failed to fetch credentials"
        });
    }
});

router.post('/' ,[
    body("website")
    .notEmpty().withMessage("Website required"),

    body("account_username")
    .notEmpty().withMessage("Account username required"),
    
    body("account_password")
    .notEmpty().withMessage("Account password required")
], authMiddleware, async (req,res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors:errors.array()});
        }
        const {account_username,account_password,website} = req.body;
        const userId = req.user.userId;
        const encryptedPassword = JSON.stringify(encrypt(account_password));
        await db.query("INSERT INTO credentials (user_id, account_username,account_password,website) VALUES (?,?,?,?)",[userId,account_username,encryptedPassword,website]);
        return res.status(201).json({message:"New credentials added successfully"});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:"Credentials not added"});
    }
});

router.delete('/:id' , authMiddleware , async (req,res) => {
    try {
        const credentialId = req.params.id;
        const userId = req.user.userId;
        await db.query("DELETE FROM credentials WHERE credential_id = ? and user_id = ? " , [credentialId,userId]);
        return res.status(200).json({message:"Credential deleted successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Failed to delete credential"});
    }
});

router.put('/:id',[
    body("website")
    .notEmpty().withMessage("Website required")
    .isURL().withMessage("Please enter a valid website URL"),

    body("account_username")
    .notEmpty().withMessage("Account username required"),
    
    body("account_password")
    .notEmpty().withMessage("Account password required")
], authMiddleware , async (req,res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors:errors.array()});
        }
        const credentialId = req.params.id;
        const userId = req.user.userId;
        const {account_username,account_password,website} = req.body;
        const encryptedPassword = JSON.stringify(encrypt(account_password));
        await db.query("UPDATE credentials SET account_username = ?, account_password = ?, website = ? WHERE credential_id = ? and user_id = ?",[account_username,encryptedPassword,website,credentialId,userId]);
        return res.status(200).json({message:"Credentials updated successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Failed to update the credential"});
    }
})


export default router;