import PatientNoteAnalysis from "../models/patientNoteAnalysis.model";



type FindNoteInput = {
    patientId: string,
    note: string
}

class NoteController {

    
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
            return null;
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