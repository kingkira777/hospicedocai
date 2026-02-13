import express = require('express');

import authRoutes from './auth';

import patientRoutes from './patient';
import fileRoutes from './file';
import casesRoutes from './cases';
import userRoute from './user';
import adrRoute from './adr';
import noteRoute from './note';


const router = express.Router();


/**
 *Index for API V1
 */
router.get("/", async(req,res) => {
    res.json({message  : "Hospice Documents (IQ) Version 0.0.1"});
    res.end();
});



router.use("/auth", authRoutes);
router.use("/patient", patientRoutes);
router.use("/file", fileRoutes);
router.use("/cases", casesRoutes);
router.use("/user", userRoute);
router.use("/adr", adrRoute);
router.use("/note", noteRoute);

export default router;
