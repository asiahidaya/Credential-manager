import express from 'express';
import db from '../db.js';
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
dotenv.config();
import { body, validationResult } from 'express-validator';
import jwt from "jsonwebtoken";
import { sendMail } from '../mail.js';

const router = express.Router();

router.post('/signup' , [
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

    body("name") 
    .notEmpty().withMessage("Name is required")
    .isLength({ min:3, max:50}).withMessage("Name must be between 3 and 50 characters")
    .matches(/^[A-Za-z]+$/).withMessage("Name must be characters")
 ] , async (req,res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors:errors.array()});
        }
        const { email, name } = req.body;
        const [users] = await db.query("SELECT name, email, role FROM users WHERE email = ?", [email]);
        if (users.length > 0){
            return res.status(400).json({message: "Email already in use"})
        }
        const role = "user";
        const [value] = await db.query("INSERT INTO users (name,email,role) VALUES (?,?,?)", [name,email,role]);
        const signUpToken = jwt.sign({userId: value.insertId , purpose:"password_setup"},process.env.SIGNUP_TOKEN,{expiresIn: "15m"});
        const emailLink = `http://localhost:5173/set-password/${signUpToken}`;
        await sendMail(email,"Set up your password",`Hello ${name}, Welcome to Credential Manager!
            Please set up your password using the link below.
            ${emailLink}
            This password will expire in 15 minutes`);
        return res.status(201).json({ message :"Signup successful!  Check your email to verify"});
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message : "Signup Failed!"});
    }
});

router.post("/login" ,[
    body("email")
    .notEmpty().withMessage("Email required"),

    body("password")
    .notEmpty().withMessage("Password required")

],async (req,res) => {
    try {
        const { email, password } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors:errors.array()});
        }
        const [users] = await db.query("SELECT user_id, name, email, role, password FROM users WHERE email = ?" ,[email]);
        const user = users[0];    
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }    
        const pswdmatch = await bcrypt.compare(password,user.password);
        if(!pswdmatch) {
            return res.status(400).json({message:"Invalid email or password"});
        }
        const token = jwt.sign({userId:user.user_id, userRole:user.role, userName:user.name} , process.env.JWT_TOKEN , {expiresIn:"1h"});
        return res.status(200).json({message: "Login successful!" , token :token});
    } catch(error) {
        console.log(error);
        return res.status(500).json({message:"Login Failed!"});
    }
});

router.post ("/set-password", [
    body("token")
    .notEmpty().withMessage("Token required") ,
    body("password")
    .notEmpty().withMessage("Password required")
    .isLength({min:8}).withMessage("Password length must be minimum 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase character")
    .matches(/[!@#$%^&*]/).withMessage("Password must contain a special character")
    .matches(/[0-9]/).withMessage("Password must contain a number")
], async(req,res) => {
    try{
        const {token, password} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors:errors.array()});
        }
        const decoded = jwt.verify(token,process.env.SIGNUP_TOKEN);
        if (decoded.purpose !== "password_setup") {
            return res.status(400).json({message:"Invalid password token"});
        }
        const pswd = await bcrypt.hash(password, 10);
        await db.query("UPDATE users SET password = ? WHERE user_id = ?", [pswd, decoded.userId]);
        return res.status(200).json({message: "Password created successfully. You can login now"});
    } catch(error) {
        console.log(error);
        return res.status(500).json({message:"Password creation failed"});
    }
});

router.post("/forgot-password", [
    body("email")
    .notEmpty().withMessage("Email required")
    .isEmail().withMessage("Invalid Email"),
    body("password")
    .notEmpty().withMessage("Password required")
    .isLength({min:8}).withMessage("Password length must be minimum 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase character")
    .matches(/[!@#$%^&*]/).withMessage("Password must contain a special character")
    .matches(/[0-9]/).withMessage("Password must contain a number")
], async(req,res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty){
            return res.status(400).json({errors:errors.array()});
        }
        const {email} = req.body;
        const [users] = await db.query("SELECT user_id, name, email FROM users WHERE email = ?",[email]);
        if(users.length === 0) {
            return res.status(404).json({message:"User not found"});
        }
        const [user] = users[0];
        return res.status(200).json({message: ""})
    } catch(error) {
        console.log(error);
        return res.status(500).json({message:"New password creation failed"});
    }
})




export default router;