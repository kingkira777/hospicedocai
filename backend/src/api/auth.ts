import express = require('express');

const router = express.Router();

import authCtrl from "../controller/auth.ctrl";


router.post("/login", async(req,res) => {
    try {
        const { email, password } = req.body;
        const user = await authCtrl.Login(email, password);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
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