import express = require('express');
import fs from 'fs';
import { analyzeMultipleRNNotes } from '../utils/API_OpenAI';
import fileCtrl from '../controller/file.ctrl';
import { AskFollowUpQuestion } from '../utils/API_OpenAI';
import path from 'path';
const router = express.Router();


router.post("/analyze-medical-paper/:patientId", async (req, res) => {
    try {
        // const { filePath } = req.body;
        const patientId = parseInt(req.params.patientId, 10);

        const patientFiles = await fileCtrl.GetFilesByPatientId(patientId);
        const files:any = [];
        for (const file of patientFiles) {
            const filePath = path.join(__dirname, `../uploads/${file.fileName}`); //'../uploads/file-1769828852608-998799239.pdf';
            files.push(filePath);
        }
        console.log('Files to be analyzed:', files);
        const result = await analyzeMultipleRNNotes(files);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});


router.post('/follow-up-question', async (req, res) => {
    try {
        const { convId, question } = req.body;
        console.log(req.body);
        const response = await AskFollowUpQuestion(convId, question);
        res.json({ response });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});




export default router;