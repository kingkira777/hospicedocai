import fs from "fs";
import z from "zod";
import { ADR_SYSTEM_PROMPT } from "../constant/AI_instructions";
import { ADRRiskSchema, ADRRiskData } from "../constant/AI_Zod_Schema";
import openai from "./OpenAI";


const AnalyzeAdrMedicalRisk = async  (filePaths:string[]): Promise<ADRRiskData | null> => {
    // 1. Create a Vector Store to hold your medical PDFs
  const vectorStore = await openai.vectorStores.create({
    name: "Hospice ADR Documents",
  });

  // Keep track of file IDs for deletion
  let fileIds: string[] = [];

  try {
    const fileStreams = filePaths.map((path) => fs.createReadStream(path));
    
    await openai.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, {
      files: fileStreams,
    });

    // Capture IDs of uploaded files
    const fileList = await openai.vectorStores.files.list(vectorStore.id);
    fileIds = fileList.data.map(f => f.id);

    // 3. Create the Auditor Assistant
    const assistant = await openai.beta.assistants.create({
      name: "ADR Risk Auditor",
      response_format: { type: "json_object" },
      instructions: ADR_SYSTEM_PROMPT,
      model: "gpt-4o",
      tools: [{ type: "file_search" }],
      tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
    });

    // 4. Ask the question
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: `Perform an ADR audit on the uploaded medical documents. 
                    Provide a risk assessment in JSON format including scores (0-100) 
                    for Medical Necessity, Governance, and Fraud.`,
        }
      ],
    });

    // Run and poll for the result
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id,
    });


    if (run.status === 'completed') {
      const messages:any = await openai.beta.threads.messages.list(thread.id);
      const content:any = messages.data[0].content[0];

      // Delete Assistant
      if(assistant?.id){
        await openai.beta.assistants.delete(assistant?.id);
      }
      
      // 2. Delete individual files from OpenAI storage
      for (const id of fileIds) {
        await openai.files.delete(id);
      }

      // 3. Delete the Vector Store
      if(run.id){
        await openai.vectorStores.delete(run.id);
      }

      if(content.type === 'text') {
          // IMPROVED CLEANING: Strips markdown and whitespace that causes "Unexpected token"
          let text = content.text.value.trim();
          const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            text = jsonMatch[0];
        }
        // Parse the raw text into a JS object
        const rawData = JSON.parse(text);
        const validatedData = ADRRiskSchema.parse(rawData);
        return validatedData;
      }
    }
    return null;
  } catch (error) {
    console.error("Error during audit:", error);
    return null;
  } 
};



export default  AnalyzeAdrMedicalRisk