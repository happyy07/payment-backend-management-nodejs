const { connectDB } = require("../db");
const { paymentSchema } = require("../model/paymentSchema");
const {
  processDateRecord,
  calculateTotalDue,
} = require("../utils/commonUtils");

module.exports = async (req, res) => {
  try {
    // Parse the request body
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const data = JSON.parse(body);

      // Log the data type of each field
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          console.log(`Field: ${key}, Type: ${typeof data[key]}`);
        }
      }

      // Validate the payment data
      const { error } = paymentSchema.validate(data);
      if (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.details[0].message }));
        return;
      }

      // Process the payment data
      processDateRecord(data);
      calculateTotalDue(data);

      // Connect to the database and insert the payment
      const db = await connectDB();
      const collection = db.collection("payments");
      const result = await collection.insertOne(data);

      // Respond with the created payment
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Payment created successfully",
          payment: result.insertedId,
        })
      );
    });
  } catch (error) {
    console.error("An error occurred while creating the payment:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ error: "An error occurred while creating the payment" })
    );
  }
};
