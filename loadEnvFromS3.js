const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Configure AWS SDK
const s3 = new AWS.S3();

// Parameters
const bucketName = "env-node-backend";
const envFileName = ".env";
const envFilePath = path.join(__dirname, envFileName);

// Function to download .env file from S3
const downloadEnvFile = async () => {
  const params = {
    Bucket: bucketName,
    Key: envFileName,
  };

  try {
    const data = await s3.getObject(params).promise();
    fs.writeFileSync(envFilePath, data.Body.toString());
    console.log(".env file downloaded successfully");
  } catch (error) {
    console.error("Error downloading .env file:", error);
    process.exit(1); // Exit the process with an error code
  }
};

// Load environment variables
const loadEnvVariables = () => {
  if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
    console.log("Environment variables loaded");
  } else {
    console.error(".env file not found");
    process.exit(1); // Exit the process with an error code
  }
};

// Main function
const main = async () => {
  await downloadEnvFile();
  loadEnvVariables();
  // Start your application here, e.g., require('./app');
};

main();
