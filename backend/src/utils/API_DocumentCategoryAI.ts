import openai from "./OpenAI";
const { pdf } = require('pdf-to-img');
import { DOCUMENT_CATEGORY } from "../constant/AI_instructions";


const DocumentCategoryAI = async (files:any) => {
    // 2. Mute them
    console.warn = () => {};
    try {
        return await Promise.all(files.map(async (file:any) => {
            
            // 1. Convert first page to image buffer
            const document = await pdf(file.path, { scale: 2 });
            let firstPageBuffer;

            // The library uses an async iterator for pages
            for await (const image of document) {
                firstPageBuffer = image; 
                break; // We only want the first page
            }

            // 2. Convert to Base64
            const base64Image = firstPageBuffer.toString('base64');

            const response:any = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role : 'system',
                        content : DOCUMENT_CATEGORY
                    },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Analyze this hospice document and categorize it into exactly one of the categories provided in the list. Return ONLY the category name." },
                            { type: "image_url", image_url: { url: `data:image/png;base64,${base64Image}`} }
                        ]
                    }
                ],
                temperature:0
            });
            return {
                fileName: file.originalname,
                category: response.choices[0].message.content.trim(),
                path : file.path
            };
        }));

    } catch (error) {
        console.error("Error in DocumentCategoryAI:", error);   
    }
};


export default DocumentCategoryAI;