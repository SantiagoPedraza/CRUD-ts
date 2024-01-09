// src/database.ts
import mongoose, { ConnectOptions } from 'mongoose';

class Database {
    private static instance: Database;

    private constructor() {}

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connect() {
        try {
            await mongoose.connect('mongodb://localhost/photo-gallery', {} as ConnectOptions);
            console.log('Conexión exitosa a MongoDB');
        } catch (error) {
            console.error('Error de conexión a MongoDB:', error);
        }
    }
}

export default Database;
