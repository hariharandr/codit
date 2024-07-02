import { NextApiRequest, NextApiResponse } from 'next';
import QuestionGenerator from '@/app/lib/models/QuestionGenerator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { questionId, answer, language } = req.body;

    if (!questionId || !answer || !language) {
        res.status(400).json({ error: 'questionId, answer, and language are required' });
        return;
    }

    try {
        const verificationResult = await QuestionGenerator.verifyAnswer(questionId, answer, language);
        console.log('Verification result:', verificationResult);
        res.status(200).json(verificationResult);
    } catch (error: any) {
        console.error('Error verifying answer:', error.message);
        res.status(500).json({ error: error.message });
    }
}
