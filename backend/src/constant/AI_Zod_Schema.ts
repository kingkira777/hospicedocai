import z from "zod";

export const ADRRiskSchema = z.object({
    patient_details: z.object({
        age: z.number(),
        diagnosis: z.string(),
        eligibility : z.enum(['Yes', 'No']).default('No'),
        address: z.string(),
    }),
    overall_score: z.number().min(0).max(100),
    status: z.enum(['Critical', 'High', 'Moderate', 'Low']),
    categories: z.object({
        medical_necessity: z.object({
        score: z.number(),
        rating: z.enum(['High', 'Medium', 'Low']),
        findings: z.array(z.string()).default([])
    }),
    governance: z.object({
        score: z.number(),
        rating: z.enum(['High', 'Medium', 'Low']),
        findings: z.array(z.string()).default([])
    }),
    fraud_misrepresentation: z.object({
        score: z.number(),
        rating: z.enum(['High', 'Medium', 'Low']),
        findings: z.array(z.string()).default([])
    })
    }),
    // Added from image_2c8fc0.png: Document-level clinical summaries
    document_highlights: z.array(z.object({
        document: z.string(),
        date: z.string(), // ISO or human readable
        highlights: z.array(z.string())
    })).default([]),
    // Added from image_2cff7f.png: Detailed Audit Topics (1-15)
    audit_topics: z.array(z.object({
        id: z.number(),
        topic_name: z.string(),
        status: z.enum(['PASS', 'FAIL', 'NEEDS WORK', 'NOT FOUND']).default('NOT FOUND'),
        finding: z.array(z.string()).default([]),
        recommendation:  z.array(z.string()).default([])
    })).default([]),
    benefit_period_evidence: z.array(z.object({
        date: z.string(),
        weight: z.string().nullable().optional(),
        bp_hr: z.string().nullable().optional(),
        spo2: z.string().nullable().optional(),
        pain: z.union([z.string(), z.number()]).nullable().optional()
    })).default([]),
    symptoms_summary: z.array(z.string()).default([]),
    missing_documents: z.array(z.string()).default([])
});

export type ADRRiskData = z.infer<typeof ADRRiskSchema>;