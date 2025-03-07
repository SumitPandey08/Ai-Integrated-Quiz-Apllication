import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error("MONGODB_URL is not defined in the environment variables");
        }

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB Connected");
    } 
    catch (err) { 
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1); 
    }
};

export default connectDB;
