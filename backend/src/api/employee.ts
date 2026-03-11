import express = require('express');
import employeeCtrl from '../controller/employee.ctrl';
const router = express.Router();


router.post('/list', async (req, res) => {
    try {
        const { companyId, limit, offset } = req.body;
        const employees = await employeeCtrl.List(companyId, limit, offset);
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(400).json({ error: (error as Error).message });
    }
});


router.post("/create", async (req, res) => {
    try {
        const employeeData = req.body;
        console.log('Received employee data:', employeeData);
        const employee = await employeeCtrl.Create(employeeData);
        res.json(employee);
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(400).json({ error: (error as Error).message });
    }
});


router.post("/update/:employeeId", async (req, res) => {
    try {
        const employeeId = parseInt(req.params.employeeId, 10);
        const updateData = req.body;
        console.log(`Updating employee with ID ${employeeId} using data:`, updateData);
        const employee = await employeeCtrl.Update(employeeId, updateData);
        res.json(employee);
    } catch (error) {
        console.error(`Error updating employee with ID ${req.params.employeeId}:`, error);
        res.status(400).json({ error: (error as Error).message });
    }
});


router.post("/remove/:employeeId", async (req, res) => {
    try {        
        const employeeId = parseInt(req.params.employeeId, 10);
        console.log(`Deleting employee with ID ${employeeId}`);
        const result = await employeeCtrl.Remove(employeeId);
        res.json(result);
    } catch (error) {
        console.error(`Error deleting employee with ID ${req.params.employeeId}:`, error);
        res.status(400).json({ error: (error as Error).message });
    }
});


router.post("/account-update/:employeeId", async (req, res) => {
    try {
        const employeeId = parseInt(req.params.employeeId, 10);
        const accountData = req.body;
        const result = await employeeCtrl.UpdateAccount(employeeId, accountData);
        res.json(result);
    } catch (error) {
        console.error(`Error updating account for employee ID ${req.params.employeeId}:`, error);
        res.status(400).json({ error: (error as Error).message });
    }
});


export default  router;