import File from "../models/files.model";
import path from "path";
import fs from "fs";


export type FileInput = {
    patientId: number;
    category: string;
    fileName: string;
    filePath: string;
    userId: number;
}

class FileController {

    GetFilesByPatientId = async (patientId: number, category ?: string) => {
        try {
            let whereClause:any = { patientId: patientId };
            if (category) {
                whereClause.category = category;
            }
            const files = await File.findAll({
                where:whereClause
            });
            return files;
        } catch (error) {
            console.error("Error in FileController GetFilesByPatientId:", error);
            throw error;
        }
    };

    CreateFile = async (fileData: FileInput ) => {
        try {
            const file = await File.create(fileData);
            return file;
        } catch (error) {
            throw error;
        }
    };

    FindOneFile = async (id: number) => {
        try {
            const file = await File.findByPk(id);
            return file;
        } catch (error) {
            throw error;
        }
    }

    CheckFileExists = async (patientId: number, fileName: string) => {
        try {
            const file = await File.findOne({ where: { patientId, fileName } });
            return file !== null;
        } catch (error) {
            throw error;
        }
    };



    DeleteFile = async (id: number) => {
        try {
            const file = await File.findByPk(id);
            if (!file) {
                throw new Error("File not found");
            }
            const filePath = path.join(__dirname, '../uploads', file.fileName);
            if(fs.existsSync(filePath)){
                fs.unlinkSync(filePath);
            }
            await file.destroy();
            return true;
        } catch (error) {
            throw error;
        }
    };

};

export default new FileController();