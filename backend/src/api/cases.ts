import express = require('express');
import fs from 'fs';
import { AnalyzeMedicalPaper } from '../utils/API_OpenAI';
import path from 'path';
const router = express.Router();


router.post("/analyze-medical-paper", async (req, res) => {
    try {
        // const { filePath } = req.body;
        const filePath = path.join(__dirname, '../uploads/file-1769828852608-998799239.pdf'); //'../uploads/file-1769828852608-998799239.pdf';
        if (!filePath) {
            return res.status(400).json({ error: "filePath is required in the request body." });
        }

        if(fs.existsSync(filePath) === false){
            return res.status(400).json({ error: "File does not exist at the specified filePath." });
        }

        if (fs.statSync(filePath).size === 0) {
            return res.status(400).json({ error: "File is empty." });
        }

        const result = await AnalyzeMedicalPaper(filePath);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});




export default router;