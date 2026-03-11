import PatientNoteAnalysis from "../models/patientNoteAnalysis.model";
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


    
    FindOne = async (payload: FindNoteInput) => {
        try {
            const note = await PatientNoteAnalysis.findOne({
                where: {
                    patientId: payload.patientId,
                    note: payload.note
                }
            });
            return note;
        } catch (error) {
            console.error("Error in NoteController FindOne:", error);
            throw error;
        }
    }


    Create = async (payload: Partial<PatientNoteAnalysis>) => {
        try {
            console.log(payload);
            const whereClause:any = {
                patientId: payload.patientId,
                note: payload.note
            }
            const res = await this.FindOne(whereClause);
            if(res?.id){
                return this.Update(payload);
            }
            const note = await PatientNoteAnalysis.create(payload);
            return note;
        } catch (error) {
            console.error("Error in NoteController SaveUpdate:", error);
            throw error;
        }
    }

    Update = async (payload: Partial<PatientNoteAnalysis>) => {
        try {

            const dataPayload = {
                data : payload.data,
                userId : payload.userId
            }
            const note = await PatientNoteAnalysis.update(dataPayload,{
                where : {
                    patientId : payload.patientId,
                    note : payload.note
                }
            });
            return note;
        } catch (error) {
            console.error("Error in NoteController Update:", error);
            throw error;
        }
    }

};


export default new NoteController();