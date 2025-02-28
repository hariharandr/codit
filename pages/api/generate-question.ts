import { NextApiRequest, NextApiResponse } from 'next';
import QuestionGenerator from '@/app/lib/models/QuestionGenerator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { topic } = req.body;

    if (!topic) {
        res.status(400).json({ error: 'Topic is required' });
        return;
    }

    try {
        const question = await QuestionGenerator.generateAndSaveQuestion(topic);

        const responseData = {
            id: question.data.id,
            available: question.data.available,
            title: question.data.title,
            description: question.data.description,
            examples: question.data.examples,
            constraints: question.data.constraints,
            follow_up: question.data.follow_up,
            topics: question.data.topics,
            hints: question.data.hints,
            difficulty: question.data.difficulty,
            test_cases: question.data.test_cases
        };

        res.status(200).json(responseData);
    } catch (error: any) {
        console.error('Error generating question:', error.message);
        res.status(500).json({ error: error.message });
    }
}
