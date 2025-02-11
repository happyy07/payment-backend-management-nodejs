const multer = require("multer");
const csvtojson = require("csvtojson");
const { paymentSchema } = require("../model/paymentSchema");
const { connectDB } = require("../db");
const { processDateRecord } = require("../utils/commonUtils");

// Configure storage for uploaded files
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("paymentCSVFile");

// Function to handle CSV upload and data insertion
async function uploadCSV(req, res) {
  try {
    // Handle file upload
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error uploading file" }));
      }

      // Convert CSV buffer to JSON
      const csvData = await csvtojson().fromString(req.file.buffer.toString());

      // Validate and insert each record
      const db = await connectDB();
      const collection = db.collection("payments");
      const validRecords = [];
      const invalidRecords = [];

      for (const record of csvData) {
        // Process each record to convert the date
        const processedRecord = processDateRecord(record);
        const { error } = paymentSchema.validate(processedRecord);
        if (error) {
          invalidRecords.push({
            processedRecord,
            error: error.details[0].message,
          });
        } else {
          validRecords.push(processedRecord);
        }
      }

      // Insert valid records into the database
      if (validRecords.length > 0) {
        await collection.insertMany(validRecords);
      }

      // Respond with validation results
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "CSV processed successfully",
          validRecordsCount: validRecords.length,
          invalidRecordsCount: invalidRecords.length,
          invalidRecords: invalidRecords,
        })
      );
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while processing the CSV" });
  }
}

module.exports = uploadCSV;
