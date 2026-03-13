import express = require('express');
import SendEmail from '../utils/API_Email';

import authRoutes from './auth';

import patientRoutes from './patient';
import fileRoutes from './file';
import casesRoutes from './cases';
import userRoute from './user';
import analysisRoute from './analysis';
import employeeRoute from './employee';


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
router.use("/analysis", analysisRoute);
router.use("/employee", employeeRoute);


/**Test */
router.post('/send-mail', async (req, res) => {
    try {
        const { to, subject, text } = req.body;
        await SendEmail({ to, subject, text });
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

export default router;
