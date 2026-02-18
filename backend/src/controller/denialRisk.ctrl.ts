import OpenAIGeneral from "../utils/API_OpenAIGeneral";
import { DenialRiskSchema } from "../constant/AI_Zod_Schema";
import { DENIAL_RISK_INSTRUCTIONS } from "../constant/AI_instructions";


const content = `
    Please perform a Diagnosis Framework Analysis on the uploaded documents for this patient. 
      
    1. Locate the 'RN Initial Assessment' for the Admission Summary.
    2. Locate the latest 'RN Recertification' or 'Update Assessment' for the Recertification Summary.
    3. If either document is missing, state "Note not found" for those specific fields.
    4. Analyze all clinical notes for findings and recommendations.
    5. Determine the LOS Risk based on clinical trajectory.
    
    Return the results in the specified JSON format.
`;

class DenialRiskAIController {

    AnalyzeDenialRisk = async (pdfPaths: string[]) => {
        return await OpenAIGeneral({
            pdfPaths,
            content,
            prompt: DENIAL_RISK_INSTRUCTIONS,
            zodSchema: DenialRiskSchema
        });
    }


};

export default new DenialRiskAIController();