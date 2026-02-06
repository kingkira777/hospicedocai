import express = require('express');
import fileCtrl from '../controller/file.ctrl';
import path from 'path';
import AnalyzeAdrMedicalRisk from '../utils/API_OpenAI_ADR';
import PatientADR from '../models/patientAdr.model';
const router = express.Router();



router.get("/data/:patientId", async(req,res) => {
    try {
        const patientId = parseInt(req.params.patientId, 10);
        const data = await PatientADR.findOne({
            where : {
                patientId : patientId,
                isDefault : true
            }
        });
        if(data){
            const rawData = data.data;
            const parsedData = JSON.parse(rawData);
            return res.json(parsedData);
        }
        return res.json({});
    } catch (error) {
        return res.status(400).json({ error: (error as Error).message });
    }
});


router.post("/analyze-adr-medical-paper/:patientId", async (req, res) => {
    try {
        // const { filePath } = req.body;
        const patientId = parseInt(req.params.patientId, 10);
        const { userId } = req.body;

        const patientFiles = await fileCtrl.GetFilesByPatientId(patientId);
        const files:any = [];
        for (const file of patientFiles) {
            const filePath = path.join(__dirname, `../uploads/${file.fileName}`); //'../uploads/file-1769828852608-998799239.pdf';
            files.push(filePath);
        }
        console.log('Files to be analyzed:', files);
        const result = await AnalyzeAdrMedicalRisk(files);

        await PatientADR.update({
            isDefault : false,
        }, {where : {patientId : patientId}});

        await PatientADR.create({
            patientId: patientId,
            data: JSON.stringify(result),
            isDefault : true,
            userId
        });
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});




export default router;