import OpenAIGeneral from "../utils/API_OpenAIGeneral";
import { ADRRiskSchema, ADRRiskData } from "../constant/AI_Zod_Schema";
import { ADR_SYSTEM_PROMPT } from "../constant/AI_instructions";
import PatientADR from "../models/patientAdr.model";


const content = `
    Perform an ADR audit on the uploaded medical documents. 
    Provide a risk assessment in JSON format including scores (0-100) 
    for Medical Necessity, Governance, and Fraud.`;

class ADRRiskAnalysisController{


    PatientADRData = async(patientId: number) => {
        const result = await PatientADR.findOne({ where: { patientId: patientId, isDefault: true } });
        if(result){
            const rawData = result.data;
            const parsedData = JSON.parse(rawData);
            return parsedData
        }
        return {};
    };


    AnalyzeADRRisk = async(patientId: number, userId: number, pdfPaths: string[]) => {
        const result = await OpenAIGeneral({ pdfPaths, prompt: ADR_SYSTEM_PROMPT, zodSchema: ADRRiskSchema, content});
        await PatientADR.update({
            isDefault : false,
        }, {where : {patientId : patientId}});

        await PatientADR.create({
            patientId: patientId,
            data: JSON.stringify(result),
            isDefault : true,
            userId
        });
        return result;
    };

};

export default new  ADRRiskAnalysisController();