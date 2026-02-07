import express = require('express');
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import fileCtrl from "../controller/file.ctrl";

const router = express.Router();


const filePath = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = filePath;
        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null,file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: async (req, file, cb) => {
        const filetypes = /pdf|jpeg|jpg|png/; // Regular expression for allowed extensions
        const mimetype = filetypes.test(file.mimetype); // Test against file's MIME type
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Test against file's extension
        const isExist = await fileCtrl.CheckFileExists(parseInt(req.body.patientId, 10), req.body.name, file.originalname);
        if (isExist) {
            return cb(new Error('Error: File already exists!'));
        }else if (mimetype && extname) {
            return cb(null, true); 
        } else {
            cb(new Error('Error: Only image files (PDF, JPEG, JPG, PNG) are allowed!'));
        }
    }
});


router.post("/upload", upload.single('file'), async(req,res) => {
    try {
        if(!req.file){
            return res.status(400).json({ error: "No file uploaded." });
        }
        const fileData = req.body;
        const fileDataToSave = {
            patientId: parseInt(fileData.patientId, 10),
            name: fileData.name,
            originalName: req.file.originalname,
            fileName: req.file.filename,
            filePath: req.file.path,
            userId: parseInt(fileData.userId, 10)
        }
        console.log('File data to be saved:', fileDataToSave);
        const file = await fileCtrl.CreateFile(fileDataToSave);
        res.json(file);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});


router.post("/by-patient/:patientId", async(req,res) => {
    try {
        const patientId = parseInt(req.params.patientId, 10);
        const name = req.body.category;
        const files = await fileCtrl.GetFilesByPatientId(patientId, name);
        res.json(files);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.post('/delete/:id', async(req,res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const file = await fileCtrl.DeleteFile(id);
        res.json(file);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});


export default router;