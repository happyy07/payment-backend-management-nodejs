const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Configure AWS SDK
const s3 = new AWS.S3();

// Parameters
const bucketName = "env-node-backend"; // Ensure this is your correct bucket name
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
    const envData = data.Body.toString();

    // Log the contents of the .env file for debugging
    console.log("Downloaded .env content:", envData); // Optional debugging step

    fs.writeFileSync(envFilePath, envData);
    console.log(
      ".env file downloaded and written to local system successfully."
    );
  } catch (error) {
    console.error("Error downloading .env file:", error);
    process.exit(1); // Exit the process with an error code if download fails
  }
};

// Load environment variables
const loadEnvVariables = () => {
  if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
    console.log("Environment variables loaded successfully.");
  } else {
    console.error(".env file not found");
    process.exit(1); // Exit the process if the .env file is not found
  }
};

// Main function
const main = async () => {
  await downloadEnvFile();
  loadEnvVariables();

  // Start your application
  require("./app"); // This will start the app.js file after loading the environment variables
};

main();
