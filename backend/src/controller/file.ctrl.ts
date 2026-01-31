import File from "../models/files.model";


export type FileInput = {
    patientId: number;
    name: string;
    fileName: string;
    filePath: string;
    userId: number;
}

class FileController {

    GetFilesByPatientId = async (patientId: number) => {
        try {
            const files = await File.findAll({
                where: {
                    patientId: patientId
                }
            });
            return files;
        } catch (error) {
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


};

export default new FileController();