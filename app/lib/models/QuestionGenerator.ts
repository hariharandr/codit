import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
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
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 1500,
                temperature: 0.7
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            const data = response.data;
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

        Verify if the provided code passes all the test cases. 
        Provide a detailed explanation of each test case result. 
        Return the response in the following JSON format.
        Dont give any other response only the JSON format as I given below not even a word or character or space to be given in the response.
        just give me an JSON format as I given below.
        Dont greet, dont say anything else othere than just giving me the JSON format as I given below.
        I need the input that i given
        expected output
        passed or not that particular output
        errorMessage if any
        so this is how the response should be given in the JSON format. 
        i want it to be an array of objects.:
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
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 1500,
                temperature: 0.7
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            const data = response.data;
            // console.log(data);
            console.log(response);
            try {
                if (data.choices && data.choices.length > 0) {
                    const verificationResult = JSON.parse(data.choices[0].message.content.trim());
                    return verificationResult;
                } else {
                    throw new Error('Failed to verify answer: No choices returned');
                }
            } catch {
                throw new Error("failed to verify", data);
            }
        } catch (error: any) {
            console.error('Error in verifyAnswer:', error);
            throw new Error('Failed to verify answer. Please Try Again by submitting the answer.');
        }
    }
}

export default QuestionGenerator;
