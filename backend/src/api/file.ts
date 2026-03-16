import express = require('express');
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import fileCtrl from "../controller/file.ctrl";
import { DOCUMENTS } from '../constant/AI_Documents';
import DocumentCategoryAI from '../utils/API_DocumentCategoryAI';
import userCtrl from '../controller/user.ctrl';

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
        const isExist = await fileCtrl.CheckFileExists(parseInt(req.body.patientId, 10), file.originalname);
        if (isExist) {
            return cb(new Error('Error: File already exists!'));
        }else if (mimetype && extname) {
            return cb(null, true); 
        } else {
            cb(new Error('Error: Only image files (PDF, JPEG, JPG, PNG) are allowed!'));
        }
    }
});


router.post("/upload", upload.array('files',30), async(req,res) => {
    try {
        // console.log(req.files);
        if(req.files?.length === 0) {
            return res.status(400).json({ error: "No file uploaded." });
        }
        const fileCategories = await DocumentCategoryAI(req.files);
        if(fileCategories?.length === 0) {
            return res.status(400).json({ error: "No file category found." });
        }
        for(const file of fileCategories as any) {
            const fileData = req.body;
            const fileDataToSave = {
                patientId: parseInt(fileData.patientId, 10),
                category: file.category.split(":")[0],
                fileName: file.fileName,
                filePath: file.path,
                userId: parseInt(fileData.userId, 10)
            }
            console.log('File data to be saved:', fileDataToSave);
            await fileCtrl.CreateFile(fileDataToSave);
        }

        await userCtrl.LogUserActivity({
            userId: req.body.userId,
            module: "File",
            action: `File uploaded for Patient Id: ${req.body.patientId}`,
            req
        });

        res.json({message : "File uploaded successfully."});
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: (error as Error).message });
    }
});


router.post("/by-patient/:patientId", async(req,res) => {
    try {
        const patientId = parseInt(req.params.patientId, 10);
        const category = req.body.category;
        const files = await fileCtrl.GetFilesByPatientId(patientId, category);

        await userCtrl.LogUserActivity({
            userId: req.body.userId,
            module: "File",
            action: `Files fetched for Patient Id: ${patientId}`,
            req
        });

        res.json(files);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.post('/delete/:id', async(req,res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const file = await fileCtrl.DeleteFile(id);

        await userCtrl.LogUserActivity({
            userId: req.body.userId,
            module: "File",
            action: `File deleted for Patient Id: ${id}`,
            req
        });

        res.json(file);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});


export default router;