import express = require('express');
import authCtrl from "../controller/auth.ctrl";

const router = express.Router();


router.post("/login", async(req,res) => {
    try {
        const { email, password } = req.body;
        const user = await authCtrl.Login(email, password);

        if(user === "user not found"){
            return res.status(404).json({ error: "User not found" });
        }

        if(user === "invalid password"){
            return res.status(401).json({ error: "Invalid password" });
        }

        return res.json(user);
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
});


router.post("/register",  async(req,res) => {
    try {
        const userData = req.body;
        const user = await authCtrl.Register(userData);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});




export default router;