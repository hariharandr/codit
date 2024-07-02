import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';
import Question from '@/app/lib/models/Question';

class QuestionGenerator {
    private static apiKey: string = process.env.OPENAI_API_KEY as string;

    private static async generatePrompt(topic: string): Promise<any> {
        const prompt = `Generate a unique coding question related to the topic "${topic}" in the exact JSON format provided below. Ensure that the question is different from any other questions you have generated before. The format should be as follows:
        {
            "id": "uuid",
            "available": true,
            "title": "Title",
            "description": "Description",
            "examples": [
                {
                    "input": {"field": "value"},
                    "output": "expected_output",
                    "explanation": "Explanation"
                }
            ],
            "constraints": ["Constraint 1", "Constraint 2"],
            "follow_up": "Follow-up question",
            "topics": ["Topic1", "Topic2"],
            "hints": ["Hint 1", "Hint 2"],
            "difficulty": "Difficulty level",
            "test_cases": [
                {
                    "input": {"field": "value"},
                    "output": "expected_output"
                }
            ]
        }`;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 1500,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData: any = await response.json();
                console.error('OpenAI API error response:', errorData);
                throw new Error(`Failed to generate question: ${errorData.error.message}`);
            }

            const data: any = await response.json();
            console.log('OpenAI API response:', data);

            if (data.choices && data.choices.length > 0) {
                return JSON.parse(data.choices[0].message.content.trim());
            } else {
                throw new Error('Failed to generate question: No choices returned');
            }
        } catch (error) {
            console.error('Error in generatePrompt:', error);
            throw new Error('Failed to generate question.');
        }
    }

    public static async generateAndSaveQuestion(topic: string): Promise<Question> {
        const questionData = await this.generatePrompt(topic);
        questionData.id = uuidv4();

        // Save the generated question data to the collection
        const collection = await Question.getCollection();
        await collection.insertOne(questionData);

        // Create and return the Question instance
        const question = await Question.create(questionData.id);
        return question;
    }

    public static async verifyAnswer(questionId: string, answer: string, language: string): Promise<any> {
        // Retrieve the question and test cases from the database
        const question = await Question.create(questionId);

        if (!question) {
            throw new Error('Question not found');
        }

        const testCases = question.data.test_cases;

        // Format the prompt for verification
        const prompt = `
        Question: ${question.data.description}

        Code:
        \`\`\`${language}
        ${answer}
        \`\`\`

        Test Cases:
        ${JSON.stringify(testCases)}

        Verify if the provided code passes all the test cases. Return the response in the following JSON format only this json give me only josn nothing else at all not even a single character or a space in the end or start of the json:
        {
            "allPassed": true/false,
            "results": [
                {
                    "input": {...},
                    "expectedOutput": "...",
                    "actualOutput": "...",
                    "passed": true/false,
                    "errorMessage": "..." // if any
                }
            ]
        }`;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: 1500,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData: any = await response.json();
                console.error('OpenAI API error response:', errorData);
                throw new Error(`Failed to verify answer: ${errorData.error.message}`);
            }

            const data: any = await response.json();

            const responseString = data.choices[0].message.content.trim();
            const jsonString = responseString.match(/{[\s\S]*}/);
            if (!jsonString) {
                throw new Error('Failed to verify answer: Response is not valid JSON');
            }

            const verificationResult = JSON.parse(jsonString[0]);
            return verificationResult;
        } catch (error: any) {
            console.error('Error in verifyAnswer:', error);
            throw new Error(`Failed to verify answer: ${error.message}`);
        }
    }
}

export default QuestionGenerator;
