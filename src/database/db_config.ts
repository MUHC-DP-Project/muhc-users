import mongoose from "mongoose";

const connectDB = async (dbURI: string) => {
	const MONGO_DB_URI: string = dbURI;
    const options: mongoose.ConnectionOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    };
    return await mongoose.connect(MONGO_DB_URI, options);
};

export default connectDB;