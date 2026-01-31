import OpenAI from "openai";
import fs from "fs";
import exp from "constants";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


const AnalyzeMedicalPaper = async (filePath: string) => {
    try {
        console.log("--- Step 1: Uploading Medical Paper ---");
        const file = await openai.files.create({
            file: fs.createReadStream(filePath),
            purpose: "assistants",
        });

        console.log("--- Step 2: Creating Vector Store for Analysis ---");
        const vectorStore = await openai.vectorStores.create({
            name: "Medical Research Knowledge Base",
            file_ids: [file.id],
        });

        console.log("--- Step 3: Configuring Medical Assistant ---");
        const assistant = await openai.beta.assistants.create({
            name: "Clinical Research Analyst",
            instructions: `You are a clinical research reviewer. Analyze medical papers 
            with high precision. Focus on methodology, sample size (N), primary endpoints, 
            and statistical significance (p-values).`,
            model: "gpt-4o", // Or 'gpt-5' if available in your tier
            tools: [{ type: "file_search" }],
            tool_resources: {
                file_search: { vector_store_ids: [vectorStore.id] }
            }
        });

        console.log("--- Step 4: Running Template 2 Analysis ---");
        const thread = await openai.beta.threads.create({
            messages: [
                {
                role: "user",
                content: `Please summarize the attached study:
                1. Identify the Primary Endpoint and Sample Size (N).
                2. Summarize Key Findings in 3 bullet points.
                3. Evaluate the Strength of Evidence (e.g., RCT vs Observational).
                4. List any Limitations mentioned by the authors.`
                }
            ]
        });

        // Start the run
        const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: assistant.id,
        });

        if (run.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(thread.id);
        const lastMessage = messages.data[0].content[0];
        
        if (lastMessage.type === 'text') {
            console.log("\n--- ANALYSIS RESULT ---\n");
            console.log(lastMessage.text.value);
            return lastMessage.text.value;
        }
        } else {
            console.error("Run failed with status:", run.status);
        }

        // Cleanup (Optional but recommended for privacy/cost)
        await openai.beta.assistants.delete(assistant.id);
        await openai.vectorStores.delete(vectorStore.id);


    } catch (error) {
        console.error("Error in AnalyzeMedicalPaper:", error);
        throw error;   
    }
};

export { openai, AnalyzeMedicalPaper };