import fs from "fs";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import { MEDICAL_SYSTEM_PROMPT } from "../constant/AI_instructions";
import openai from "./OpenAI";

const MedicalExtractionSchema = z.object({
  file_name: z.string().describe("Name of the file"),
  risk : z.object({
      level: z.enum(['Low', 'Medium', 'High']),
      justification: z.string(),
  }),
  summary: z.object({
    is_documented: z.boolean(),
    visit_date: z.string().nullable(),
    clinician_signature_present: z.boolean(),
  }),
  physical_assessment: z.object({
    vitals: z.string().describe("Height, Weight, Pulse, BP, Temp, O2 if found"),
    cardiac_findings: z.string().nullable(),
    skin_wound_notes: z.string().nullable(),
  }),
  indicators_of_decline: z.array(z.string()).describe("Any mention of worsening symptoms"),
  suggested_care_plan_updates: z.array(z.string()),
  hallucination_check: z.string().describe("Direct quote from the PDF used for this summary"),
  narrative: z.string().describe("Check if the summary is correct or incorrect and related to whole document, Answer it with relevant/irrelevant and then follow up with a summary of the findings"),
  missing : z.string().describe("Any mention of missing data"),
  strengthen_the_case : z.string().describe("Give a suggestion or advice to strengthen the case if the documents is incomplete or inconsistent"),
  non_rn_notes: z.string().describe("Summary if not a RN Notes"),
});

const MultiFileResponseSchema = z.object({
  analysis_results: z.array(MedicalExtractionSchema).describe("List of results for each document")
});



const analyzeMultipleRNNotes = async (pdfPaths: string[]) => {
    try {
     
        const uploadedFiles = await Promise.all(
            pdfPaths.map(async (path) => {
            const file = await openai.files.create({
                file: fs.createReadStream(path),
                purpose: "user_data",
            });
            return file.id;
            })
        );

        // 2. Prepare the multi-file content for the user message
        const fileInputs = uploadedFiles.map(id => ({
            type: "input_file" as const,
            file_id: id
        }));

        // 3. Request Analysis with Medical Persona (Developer Role)
        console.log("Analyzing files with Professional Medical Assistant persona...");

        let analysisResult:any;
        let attempts = 0;

        while (attempts < 3) {
            try {
                
                analysisResult = await openai.responses.create({
                    metadata : {
                        "auto_delete_after": "30" // 1 hour (3600 seconds)
                    },
                    model: "gpt-4o",
                    input: [
                        {
                            role: "developer",
                            content: [{ type: "input_text", text: MEDICAL_SYSTEM_PROMPT }] // Same prompt as before
                        },
                        {
                            role: "user",
                            content: [
                            { type: "input_text", text: "Please compare and extract data from these attached notes. Identify any discrepancies in F2F or clinical decline across these documents." },
                            ...fileInputs // Spread the array of file IDs here
                            ]
                        }
                    ],
                    // Extracting an array of results, one for each file
                    text: {
                        format: zodTextFormat(MultiFileResponseSchema, "medical_batch")
                    }
                });
                break;
            } catch (error: any) {
                if (error.status === 404) {
                    console.log("Files still indexing... waiting 2 seconds.");
                    await new Promise(res => setTimeout(res, 2000));
                    attempts++;
                } else {
                    throw error;
                }
                
            }
        }

        // 4. Return the analysis results
        const finalResults = JSON.parse(analysisResult.output_text);

        // 5. Clean up uploaded files
        await Promise.all(
            uploadedFiles.map(async (fileId) => {
                await openai.files.delete(fileId);
            })
        )
        return { convId: null, finalResults };
    } catch (error) {
        console.error("Error in AnalyzeMedicalPaper:", error);
        throw error;   
    }
};


const AskFollowUpQuestion = async (convId: string, question: string) => {
    try {
        const response = await openai.responses.create({
            model: "gpt-4o",
            conversation : convId,
            input: [
                {
                    role: "user",
                    content: [{ type: "input_text", text: question }] // Same prompt as before
                }
            ]
        });
        return response.output_text;
    } catch (error) {
        console.error("Error in AnalyzeMedicalPaper:", error);
        throw error;   
    }
};

export { openai, analyzeMultipleRNNotes, AskFollowUpQuestion };