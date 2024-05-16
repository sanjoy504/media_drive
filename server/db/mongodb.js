// config/db.js
import { connect } from 'mongoose';

const connectToMongo = async () => {

    try {

        const connectionInstance = await connect(process.env.DB_CONNECTION_STRING);
        console.log(`MongoDB is connected to MediaCloud db host :${connectionInstance.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

export default connectToMongo;