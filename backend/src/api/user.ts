import express = require('express');

import userCtrl from '../controller/user.ctrl';

const router = express.Router();



router.get("/list", async(req,res) => {
    try {
        const companyId = parseInt(req.query.companyId as string, 10);
        const userId = parseInt(req.query.userId as string, 10);
        const users = await userCtrl.List(companyId,userId);
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.get("/get/:id", async(req,res) => {
    try {
        const id = parseInt(req.params.id, 10); // Convert to number
        const user = await userCtrl.GetById(id);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
})

router.post("/create", async(req,res) => {
    try {
        const userData = req.body;
        const user = await userCtrl.Create(userData);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});


router.post("/update/:id", async(req,res) => {
    try {
        const id = parseInt(req.params.id, 10); // Convert to number
        const updateData = req.body;
        const user = await userCtrl.Update(id, updateData);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});


router.post("/remove/:id", async(req,res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const user = await userCtrl.Remove(id);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});


export default router;