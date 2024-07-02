import fs from 'fs';
import path from 'path';
import Question from '@/app/lib/models/Question';
import DatabaseConnection from '@/app/lib/DatabaseConnection';

// Directory where question JSON files are stored
const QUESTIONS_DIR = path.join(__dirname, 'questions/list');

async function syncQuestions() {
    try {
        const files = fs.readdirSync(QUESTIONS_DIR);

        for (const file of files) {
            if (path.extname(file) === '.json') {
                const filePath = path.join(QUESTIONS_DIR, file);
                const rawData = fs.readFileSync(filePath, 'utf-8');
                const questionData = JSON.parse(rawData);

                const existingQuestion = await Question.findById(questionData.id);
                if (!existingQuestion) {
                    const question = new Question(questionData.id);
                    question.data = questionData;
                    await question.save();
                    console.log(`Inserted question: ${questionData.id}`);
                } else {
                    console.log(`Question already exists: ${questionData.id}`);
                }
            }
        }

        console.log('Sync completed');
    } catch (error: any) {
        console.error(`Failed to sync questions: ${error.message}`);
    }
}

syncQuestions();
