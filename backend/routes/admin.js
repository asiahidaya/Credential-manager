import express from 'express';
import db from '../db.js'

const router = express.Router()


router.get('/users', async(req,res) => {
    const [users] = await db.query("SELECT user_id, name, email, role FROM users");
    return res.status(200).json({message: "Fetched all users", users: users});
});

router.delete('/users/:id', async(req,res) => {
    try {
    const userId = Number(req.params.id);
    if(userId === req.user.userId) {
        return res.status(400).json({message: "Cannot delete your own profile"})
    }
    await db.query("DELETE FROM users WHERE user_id = ?",[userId])
    return res.status(200).json({message:"User deleted successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Failed to delete user"});
    }
})

router.put('/users/:id', async(req,res) => {
    try{
        const userId = Number(req.params.id);
        if(userId === req.user.userId) {
            return res.status(400).json({message:"Cannot change your own role"})
        }
        await db.query("UPDATE users SET role = ? WHERE user_id = ?",["admin", userId]);
        return res.status(200).json({message: "User role updated to admin successfully"});
    } catch(error) {
        console.log(error);
        return res.status(400).json({message: "Failed to update the role"});
    }
})


export default router;
