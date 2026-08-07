import { genAI } from './gemini';

export interface TicketAnalysisResult {
    category: string;
    subcategory: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    sentiment: string;
    intent: string;
    urgency: string;
    language: string;
    confidenceScore: number;
    summary: string;
}

const defaultAnalysis: TicketAnalysisResult = {
    category: 'General',
    subcategory: 'Other',
    priority: 'medium',
    sentiment: 'Neutral',
    intent: 'Unknown',
    urgency: 'low',
    language: 'en',
    confidenceScore: 0.1,
    summary: 'AI analysis failed. Manual review required.',
};

export async function analyzeTicket(subject: string, body: string): Promise<TicketAnalysisResult> {
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
You are an expert customer support triage AI. Analyze the following customer support ticket and return a JSON object containing the required fields.

Ticket Subject: ${subject}
Ticket Body: ${body}

Return a valid JSON object strictly matching this schema:
{
  "category": "string (e.g., Technical Support, Billing, Sales, Account)",
  "subcategory": "string (e.g., Login Issue, Refund Request, Inquiry)",
  "priority": "string (strictly one of: low, medium, high, urgent)",
  "sentiment": "string (e.g., Angry, Frustrated, Neutral, Happy)",
  "intent": "string (what the customer wants to achieve)",
  "urgency": "string (e.g., low, medium, high)",
  "language": "string (2-letter language code, e.g., en, es)",
  "confidenceScore": "number (between 0.0 and 1.0 representing your confidence in this analysis)",
  "summary": "string (a 1-2 sentence summary of the issue)"
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
            const parsed = JSON.parse(text);
            return {
                category: parsed.category || defaultAnalysis.category,
                subcategory: parsed.subcategory || defaultAnalysis.subcategory,
                priority: ['low', 'medium', 'high', 'urgent'].includes(parsed.priority) ? parsed.priority : defaultAnalysis.priority,
                sentiment: parsed.sentiment || defaultAnalysis.sentiment,
                intent: parsed.intent || defaultAnalysis.intent,
                urgency: parsed.urgency || defaultAnalysis.urgency,
                language: parsed.language || defaultAnalysis.language,
                confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : defaultAnalysis.confidenceScore,
                summary: parsed.summary || defaultAnalysis.summary,
            };
        } catch (parseError) {
            console.error('Failed to parse Gemini response as JSON:', parseError, 'Raw text:', text);
            return defaultAnalysis;
        }
    } catch (error) {
        console.error('Ticket analysis failed:', error);
        return defaultAnalysis;
    }
}
