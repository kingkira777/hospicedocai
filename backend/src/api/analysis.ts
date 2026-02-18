import express = require('express');

const router = express.Router();

import path from 'path';
import fileCtrl from '../controller/file.ctrl';
import denialRiskCtrl from '../controller/denialRisk.ctrl';
import adrCtrl from '../controller/adr.ctrl';




router.post("/denial-risk/:patientId", async (req, res) => {
    try {
        const patientId = parseInt(req.params.patientId, 10);
        const patientFiles = await fileCtrl.GetFilesByPatientId(patientId);

        if(patientFiles.length === 0){
            return res.status(200).json({ type: "error", message: "No files found for this patient" });
        }

        const files:any = [];
        for (const file of patientFiles) {
            const filePath = path.join(__dirname, `../uploads/${file.fileName}`); 
            files.push(filePath);
        }

        if(files.length === 0){
            return res.status(200).json({ type: "error", message: "No RN Initial or Update Assessment files found for this patient" });
        }

        const result = await denialRiskCtrl.AnalyzeDenialRisk(files);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});



// ADR Analysis

router.post('/adr-data/:patientId', async (req, res) => {
    try {
        const patientId = parseInt(req.params.patientId, 10);
        const data = await adrCtrl.PatientADRData(patientId);
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: (error as Error).message });
    } 
});


router.post('/adr-analyze/:patientId', async (req, res) => {
    try {
            // const { filePath } = req.body;
        const patientId = parseInt(req.params.patientId, 10);
        const { userId } = req.body;

        const patientFiles = await fileCtrl.GetFilesByPatientId(patientId);
        const files:any = [];
        for (const file of patientFiles) {
            const filePath = path.join(__dirname, `../uploads/${file.fileName}`); 
            files.push(filePath);
        }
        console.log('Files to be analyzed:', files);
        const result = await adrCtrl.AnalyzeADRRisk(patientId, userId, files);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: (error as Error).message });
    }
});




export default router;