import express = require('express');

import userCtrl from '../controller/user.ctrl';

const router = express.Router();


router.get("/activity-logs?", async(req,res) => {
    try {
        const userId = parseInt(req.query.userId as string, 10);
        const limit = parseInt((req.query.limit as string) || '10', 10);
        const offset = parseInt((req.query.offset as string) || '0', 0);
        const userActivity = await userCtrl.GetUserActivity(userId, limit, offset);
        res.json(userActivity);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});



router.get("/list", async(req,res) => {
    try {
        const companyId = parseInt(req.query.companyId as string, 10);
        const userId = parseInt(req.query.userId as string, 10);
        const users = await userCtrl.List(companyId,userId);

        await userCtrl.LogUserActivity({
            userId,
            module: "User",
            action: "List",
            req
        });

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

        await userCtrl.LogUserActivity({
            userId: req.body.userId,
            module: "User",
            action: "Create",
            req
        });

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

        await userCtrl.LogUserActivity({
            userId: req.body.userId,
            module: "User",
            action: "Update",
            req
        });

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