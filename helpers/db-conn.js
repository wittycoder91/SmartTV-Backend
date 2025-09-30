const { MongoClient } = require("mongodb");
// const mongodbUri = "mongodb://localhost:27017/";
const mongodbUri =
  "mongodb://admin:xg7wz%402slm9!@68.178.168.213:27017/?authSource=admin";
const client = new MongoClient(mongodbUri);
let db;

const connectToDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected to MongoDB");

    // Verify connection and initialize the database
    db = client.db("smarttv");
    if (!db) {
      throw new Error("Database 'smarttv' is undefined. Check the database name.");
    }
    console.log("Database selected:", db.databaseName);
  } catch (e) {
    console.error("Error connecting to MongoDB:", e);
  } finally {
    if (client) {
      await client.dis;
      console.log("MongoDB connection closed");
    }
  }
};

getDb = () => {
  return db;
};

getAdminCollection = () => {
  return db.collection("admins");
};
getQuestionsCollection = () => {
  return db.collection("questions");
};

getButtonLabelsCollection = () => {
  return db.collection("buttonLabels");
};

getImagesCollection = () => {
  return db.collection("images");
};

getBackgroundImageCollection = () => {
  return db.collection("backgroundImage");
};

module.exports = {
  getDb,
  connectToDatabase,
  getQuestionsCollection,
  getButtonLabelsCollection,
  getImagesCollection,
  getBackgroundImageCollection,
  getAdminCollection,
};
