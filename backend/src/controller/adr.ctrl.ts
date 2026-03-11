import OpenAIGeneral from "../utils/API_OpenAIGeneral";
import { ADRRiskSchema, ADRRiskData } from "../constant/AI_Zod_Schema";
import { ADR_SYSTEM_PROMPT } from "../constant/AI_instructions";
import PatientAnalysisData from "../models/patientAnalysisData.model";

const content = `
    Perform an ADR audit on the uploaded medical documents. 
    Provide a risk assessment in JSON format including scores (0-100) 
    for Medical Necessity, Governance, and Fraud.`;

class ADRRiskAnalysisController{


    PatientADRData = async(patientId: number) => {
        const result = await PatientAnalysisData.findOne({ where: { patientId: patientId, tag: 'adr', isDefault: true } });
        if(result){
            const rawData = result.data;
            const parsedData = JSON.parse(rawData);
            return parsedData
        }
        return {};
    };


    AnalyzeADRRisk = async(patientId: number, userId: number, pdfPaths: string[]) => {
        const result = await OpenAIGeneral({ pdfPaths, prompt: ADR_SYSTEM_PROMPT, zodSchema: ADRRiskSchema, content});
        await PatientAnalysisData.update({
            isDefault : false,
        }, {where : {patientId : patientId, tag:'adr'}});

        await PatientAnalysisData.create({
            patientId: patientId,
            tag: 'adr',
            data: JSON.stringify(result),
            isDefault : true,
            userId
        });
        return result;
    };

};

export default new  ADRRiskAnalysisController();