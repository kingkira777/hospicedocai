import { analyzeMultipleRNNotes } from "../utils/API_OpenAI";
import PatientAnalysisData from "../models/patientAnalysisData.model";

type FindNoteInput = {
    patientId: string,
    note: string
}

class NoteController {

    PatientAnalysisData = async(patientId: number, note:string) => {
        const result = await PatientAnalysisData.findOne({ where: { patientId: patientId, tag: note, isDefault: true } });
        if(result){
            const rawData = result.data;
            const parsedData = JSON.parse(rawData);
            return parsedData
        }
        return {};
    }

    AnalyzeNote = async(patientId:number, userId: number, note: string, pdfPaths: string[]) => {
        const result = await analyzeMultipleRNNotes(pdfPaths);
        await PatientAnalysisData.update({
            isDefault : false,
        }, {where : {patientId : patientId, tag:note}});
        await PatientAnalysisData.create({
            patientId: patientId,
            tag: note,
            data: JSON.stringify(result),
            isDefault : true,
            userId
        });
        return result;
    }
};


export default new NoteController();