import File from "../models/files.model";
import path from "path";
import fs from "fs";


export type FileInput = {
    patientId: number;
    name: string;
    fileName: string;
    filePath: string;
    userId: number;
}

class FileController {

    GetFilesByPatientId = async (patientId: number, name ?: string) => {
        try {
            let whereClause:any = { patientId: patientId };
            if (name) {
                whereClause.name = name;
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

    CheckFileExists = async (patientId: number, name: string, fileName: string) => {
        try {
            const file = await File.findOne({ where: { patientId, name, fileName } });
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
            const filePath = path.join(__dirname, '../uploads', file.originalName);
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