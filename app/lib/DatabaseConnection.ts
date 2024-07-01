import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const username = process.env.MONGODH_USERNAME as string;
const password = process.env.MONGODB_PASSWORD as string;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri || !username || !password) {
    throw new Error('Please add your MongoDB URI, username, and password to .env');
}

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

client = new MongoClient(`mongodb+srv://${username}:${password}${uri}`);
clientPromise = client.connect();

class DatabaseConnection {
    private static db: Db | null = null;

    static async getDefaultDatabase(): Promise<Db> {
        if (!this.db) {
            return this.getDatabase();
        }
        return this.db;
    }

    static async getDatabase(dbName: string = 'codit'): Promise<Db> {
        const client = await clientPromise;
        return client.db(dbName);
    }
}

export default DatabaseConnection;
