import express = require('express');
import employeeCtrl from '../controller/employee.ctrl';
import userCtrl from '../controller/user.ctrl';
const router = express.Router();


router.post('/list', async (req, res) => {
    try {
        const { companyId, limit, offset, userId } = req.body;
        const employees = await employeeCtrl.List(companyId, limit, offset);

        await userCtrl.LogUserActivity({
            userId,
            module: "Employee",
            action: "List",
            req
        });

        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(400).json({ error: (error as Error).message });
    }
});


router.post("/create", async (req, res) => {
    try {
        const employeeData = req.body;
        const employee = await employeeCtrl.Create(employeeData);

        await userCtrl.LogUserActivity({
            userId: req.body.userId,
            module: "Employee",
            action: "Create",
            req
        });

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
        const employee = await employeeCtrl.Update(employeeId, updateData);

        await userCtrl.LogUserActivity({
            userId: req.body.userId,
            module: "Employee",
            action: "Update",
            req
        });

        res.json(employee);
    } catch (error) {
        console.error(`Error updating employee with ID ${req.params.employeeId}:`, error);
        res.status(400).json({ error: (error as Error).message });
    }
});


router.post("/remove/:employeeId", async (req, res) => {
    try {        
        const employeeId = parseInt(req.params.employeeId, 10);
        const result = await employeeCtrl.Remove(employeeId);

        await userCtrl.LogUserActivity({
            userId: req.body.userId,
            module: "Employee",
            action: "Remove",
            req
        });

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

        await userCtrl.LogUserActivity({
            userId: req.body.userId,
            module: "Employee",
            action: "UpdateAccount",
            req
        });

        res.json(result);
    } catch (error) {
        console.error(`Error updating account for employee ID ${req.params.employeeId}:`, error);
        res.status(400).json({ error: (error as Error).message });
    }
});


export default  router;