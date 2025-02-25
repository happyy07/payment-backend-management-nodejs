const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const s3 = new AWS.S3();

const bucketName = "env-node-backend";
const envFileName = ".env";
const envFilePath = path.join(__dirname, envFileName);

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
    process.exit(1);
  }
};

const loadEnvVariables = () => {
  if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
    console.log("Environment variables loaded");
  } else {
    console.error(".env file not found");
    process.exit(1);
  }
};

const main = async () => {
  await downloadEnvFile();
  loadEnvVariables();
};

main();
