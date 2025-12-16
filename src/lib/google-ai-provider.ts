import 'server-only';

import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const googleAIClient = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
});

