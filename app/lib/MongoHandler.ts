import { Collection } from 'mongodb';
import DatabaseConnection from '@/app/lib/DatabaseConnection';
import MongoInterceptor from '@/app/util/MongoInterceptor';

class MongoHandler {
    public data: any = {};
    private collection!: Collection;

    constructor() { }

    async initialize(id: string, collectionName: string) {
        this.collection = await MongoHandler.getCollection(collectionName);
        const data = await this.collection.findOne({ id });
        if (data) {
            this.data = data;
        } else {
            this.data = {};
        }
        return new Proxy(this, MongoInterceptor);
    }

    static async getCollection(collectionName: string) {
        const db = await DatabaseConnection.getDefaultDatabase();
        return db.collection(collectionName);
    }

    async save() {
        await this.collection.updateOne(
            { id: this.data.id },
            { $set: this.data },
            { upsert: true }
        );
    }

    static async create(id: string, collectionName: string): Promise<MongoHandler> {
        const handler = new MongoHandler();
        return await handler.initialize(id, collectionName);
    }
}

export default MongoHandler;
