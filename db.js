const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URL;
const database = process.env.DATABASE_NAME;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    return client.db(database);
  } catch (error) {
    console.error("An error occurred while connecting to MongoDB:", error);
    throw error;
  }
}

module.exports = { connectDB, client };
