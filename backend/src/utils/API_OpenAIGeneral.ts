import openai from "./OpenAI";
import fs from "fs";

type Props = {
    pdfPaths: string[],
    prompt: string,
    content : string,
    zodSchema : any
}

const OpenAIGeneral = async ({pdfPaths, content, prompt, zodSchema}: Props) => {

    console.log(`Files: `, pdfPaths);

    // 1. Create a Vector Store to hold your medical PDFs
    const vectorStore = await openai.vectorStores.create({
        name: "Hospice Documents (IQ)",
    });

    // Keep track of file IDs for deletion
    let fileIds: string[] = []; 
    let assistant = null;
    let run = null;


    try {
        const fileStreams = pdfPaths.map((path) => fs.createReadStream(path));

        await openai.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, {
            files: fileStreams,
        });

        // Capture IDs of uploaded files
        const fileList = await openai.vectorStores.files.list(vectorStore.id);
        fileIds = fileList.data.map(f => f.id);

        // 3. Create the Auditor Assistant
        assistant = await openai.beta.assistants.create({
            name: "ADR Risk Auditor",
            response_format: { type: "json_object" },
            instructions: prompt,
            model: "gpt-4o",
            tools: [{ type: "file_search" }],
            tool_resources: { file_search: { vector_store_ids: [vectorStore.id] }   },
        });
        
        // 4. Ask the question
        const thread = await openai.beta.threads.create({
            messages: [
            {
                role: "user",
                content: content,
            }
            ],
        });

        // Run and poll for the result
        run = await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: assistant.id,
        });
        console.log(run);
        if (run.status === 'completed') {
            const messages:any = await openai.beta.threads.messages.list(thread.id);
            const content:any = messages.data[0].content[0];
        
            if(content.type === 'text') {
                // IMPROVED CLEANING: Strips markdown and whitespace that causes "Unexpected token"
                let text = content.text.value.trim();
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    text = jsonMatch[0];
                }
                // Parse the raw text into a JS object
                const rawData = JSON.parse(text);
                console.log(rawData);
                const validatedData = zodSchema.parse(rawData);
                return validatedData;
            }
        }

        if (run.status === 'failed') {
            return run.last_error;
        }
    } catch (error) {
        console.log(error);
        return null;
    } finally {
        // Delete Assistant
        if(assistant?.id){
            await openai.beta.assistants.delete(assistant?.id);
        }
        
        // 2. Delete individual files from OpenAI storage
        for (const id of fileIds) {
            await openai.files.delete(id);
        }

        // 3. Delete the Vector Store
        if(vectorStore?.id){
            await openai.vectorStores.delete(vectorStore.id);
        }
    }
};


export default OpenAIGeneral


