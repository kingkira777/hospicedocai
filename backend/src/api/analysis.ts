import express = require('express');

const router = express.Router();

import path from 'path';
import fileCtrl from '../controller/file.ctrl';
import denialRiskCtrl from '../controller/denialRisk.ctrl';
import adrCtrl from '../controller/adr.ctrl';
import noteCtrl from '../controller/note.ctrl';
import userCtrl from '../controller/user.ctrl';


//Note Analysis

router.post('/note-data/:patientId', async (req, res) => {
    try {
        const patientId = parseInt(req.params.patientId, 10);
        const { note } = req.body; 
        const data = await noteCtrl.PatientAnalysisData(patientId, note);
        
        await userCtrl.LogUserActivity({
            userId: req.body.userId,
            module: "Note",
            action: `Get Data for Patient Id: ${patientId}`,
            req
        });

        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: (error as Error).message });
    }
});

router.post('/note/:fileId', async (req, res) => {
    try {
        const files:any = [];
        const fileId = parseInt(req.params.fileId, 10);
        const { userId, patientId, note } = req.body;
        const patientFiles = await fileCtrl.FindOneFile(fileId);
        const filePath = path.join(__dirname, `../uploads/${patientFiles?.fileName}`);
        files.push(filePath);
        console.log('Files to be analyzed:', files);
        const result = await noteCtrl.AnalyzeNote(patientId, userId, note, files);

        await userCtrl.LogUserActivity({
            userId: req.body.userId,
            module: "Note",
            action: `Analyze Note for Patient Id: ${patientId}`,
            req
        });

        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: (error as Error).message });
    }
});



//Denial Risk Analysis
router.post('/denial-risk-data/:patientId', async (req, res) => {
    try {
        const patientId = parseInt(req.params.patientId, 10);
        const data = await denialRiskCtrl.PatientDenialRiskData(patientId);

        await userCtrl.LogUserActivity({
            userId: req.body.userId,
            module: "Denial Risk",
            action: `Get Data for Patient Id: ${patientId}`,
            req
        });

        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: (error as Error).message });
    }
});

router.post("/denial-risk/:patientId", async (req, res) => {
    try {
        const patientId = parseInt(req.params.patientId, 10);
        const patientFiles = await fileCtrl.GetFilesByPatientId(patientId);
        const { userId } = req.body;

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

        const result = await denialRiskCtrl.AnalyzeDenialRisk(patientId, userId, files);

        await userCtrl.LogUserActivity({
            userId: req.body.userId,
            module: "Denial Risk",
            action: `Analyze Denial Risk for Patient Id: ${patientId}`,
            req
        });

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

        await userCtrl.LogUserActivity({
            userId: req.body.userId,
            module: "ADR",
            action: `Get Data for Patient Id: ${patientId}`,
            req
        });

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

        await userCtrl.LogUserActivity({
            userId: req.body.userId,
            module: "ADR",
            action: `Analyze ADR for Patient Id: ${patientId}`,
            req
        });

        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: (error as Error).message });
    }
});




export default router;