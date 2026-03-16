import express = require('express');

import patientCtrl from "../controller/patient.ctrl";
import userCtrl from '../controller/user.ctrl';

const router = express.Router();



router.get("/list-select", async(req,res) => {
    try {
        const companyId = parseInt(req.query.companyId as string, 10);
        const patients = await patientCtrl.ListSelect(companyId);
        res.json(patients);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.get("/list", async(req,res) => {
    try {
        const companyId = parseInt(req.query.companyId as string, 10);
        const offset = parseInt((req.query.offset as string) || '0', 10);
        const limit = parseInt((req.query.limit as string) || '10', 10);
        const patients = await patientCtrl.List(companyId, offset, limit);
        const userId = parseInt(req.query.userId as string, 10);

        await userCtrl.LogUserActivity({
            userId,
            module: "Patient",
            action: "List",
            req
        });

        res.json(patients);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});


router.post("/create", async(req,res) => {
    try {
        const patientData = req.body;
        const patient = await patientCtrl.Create(patientData);
        if(patient === 'exceeded'){
            return res.json({ message: "Patient limit reached for this company." });
        }

        if(patient === 'exists'){
            return res.json({ message: "Patient and SOC already exists." });
        }

        await userCtrl.LogUserActivity({
            userId: req.body.userId,
            module: "Patient",
            action: "Create",
            req
        });

        res.json(patient);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});


router.get("/get/:id", async(req,res) => {
    try {
        const id = parseInt(req.params.id, 10); // Convert to number
        const patient = await patientCtrl.GetById(id);
        res.json(patient);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.post("/update/:id", async(req,res) => {
    try {
        const id = parseInt(req.params.id, 10); // Convert to number
        const updateData = req.body;
        const patient = await patientCtrl.Update(id, updateData);

        await userCtrl.LogUserActivity({
            userId: req.body.userId,
            module: "Patient",
            action: "Update",
            req
        });

        res.json(patient);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.post("/remove/:id", async(req,res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const patient = await patientCtrl.Remove(id);

        await userCtrl.LogUserActivity({
            userId: req.body.userId,
            module: "Patient",
            action: "Remove",
            req
        });

        res.json(patient);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export default router;