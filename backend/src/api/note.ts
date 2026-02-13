import express = require('express');
import { analyzeMultipleRNNotes } from '../utils/API_OpenAI';
import fileCtrl from '../controller/file.ctrl';
import noteCtrl from '../controller/note.ctrl';
import path from 'path';
const router = express.Router();


router.post("/find", async (req, res) => {
    try {
        const result = await noteCtrl.FindOne(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.post("/create", async (req, res) => {
    try {
        const result = await noteCtrl.Create(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.post("/update", async (req, res) => {
    try {
        const updateData = req.body;
        const result = await noteCtrl.Update(updateData);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    } 
});



router.post("/analyze-medical-paper/:fileId", async (req, res) => {
    try {
        const files:any = [];
        const fileId = parseInt(req.params.fileId, 10);
        const patientFiles = await fileCtrl.FindOneFile(fileId);
        const filePath = path.join(__dirname, `../uploads/${patientFiles?.fileName}`);
        files.push(filePath);
        console.log('Files to be analyzed:', files);
        const result = await analyzeMultipleRNNotes(files);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});






export default router