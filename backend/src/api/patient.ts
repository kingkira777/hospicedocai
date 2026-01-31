import express = require('express');

import patientCtrl from "../controller/patient.ctrl";

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
        res.json(patients);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});


router.post("/create", async(req,res) => {
    try {
        const patientData = req.body;
        const patient = await patientCtrl.Create(patientData);
        if(!patient){
            return res.json({ message: "Patient limit reached for this company." });
        }
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
        res.json(patient);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.post("/remove/:id", async(req,res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const patient = await patientCtrl.Remove(id);
        res.json(patient);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export default router;