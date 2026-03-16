import express from "express";
import cors from "cors";
import api from './api';
import db from './models';
import path from "path";
import nocache from "nocache";

import { NotFound } from "./middleware/API_404.md";

const app = express();



/**
 * body-parsing middleware to populate req.body
 */
app.set('trust proxy', true);
app.use(nocache());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



/**
 * Initialize DB
 */
db.sync().then(() => {
    console.log("DB Connected!");
});


/**
 * Routers
 */

app.use("/api/v1", api);




/**
 * 404 Not Found
 * 
 */
app.use((req,res) => {
    return NotFound(req,res);
});


export default app;