import { Response } from "express";


const Responses = {

    _DefineResponse : (res:Response, statusCode:number, data:any) => {
        return res.status(statusCode).json(data);
    },

    _200 : (res:Response, data:any) => {
        return res.status(200).json(data);
    },
    
    _401 : (res:Response, message:string) => {
        return res.status(401).json({message : message});
    },
    
    _404 : (res:Response, message:string) => {
        return res.status(400).json({message : message});
    },

    _500 : (res:Response, err:any) => {
        return res.status(500).json({error : err});
    }

};


export default Responses;