import { Collection } from 'mongodb';
import DatabaseConnection from '@/app/lib/DatabaseConnection';
import uuid from 'uuid';

class Question {
    public data: any = {};
    private collection!: Collection;
    id: string | undefined;


    private constructor() { }

    private async initialize(id: string) {
        this.collection = await Question.getCollection();
        const data = await this.collection.findOne({ id });
        if (data) {
            this.data = data;
        } else {
            this.data = {};
        }
    }

    static async getCollection() {
        const db = await DatabaseConnection.getDefaultDatabase();
        return db.collection('questions');
    }

    async save() {
        await this.collection.updateOne(
            { id: this.data.id },
            { $set: this.data },
            { upsert: true }
        );
    }

    static async getAllQuestions() {
        const collection = await this.getCollection();
        const questions = await collection.find().toArray();
        return questions;
    }

    static async syncFromDisk() {
        const fs = require('fs');
        const path = require('path');
        const questionsDir = path.join(process.cwd(), 'questions/list');

        const files = fs.readdirSync(questionsDir);
        const collection = await this.getCollection();

        for (const file of files) {
            const filePath = path.join(questionsDir, file);
            const questionData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            await collection.updateOne(
                { id: questionData.id },
                { $set: questionData },
                { upsert: true }
            );
        }
    }

    static async create(id: string): Promise<Question> {
        const question = new Question();
        await question.initialize(id);
        return question;
    }

    getTitle() {
        return this.data.title;
    }

    async setTitle(title: string) {
        this.data.title = title;
        await this.save();
    }
}

export default Question;
