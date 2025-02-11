const { connectDB } = require("../db");
const { paymentUpdateSchema } = require("../model/paymentSchema");
const {
  processDateRecord,
  calculateTotalDue,
} = require("../utils/commonUtils");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  try {
    // Parse the request body
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const data = JSON.parse(body);

      // Validate the payment data
      const { error } = paymentUpdateSchema.validate(data);
      if (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.details[0].message }));
        return;
      }

      // Check if evidence_file_id is required
      if (
        data.payee_payment_status === "completed" &&
        (!data.evidence_file_id || data.evidence_file_id.trim() === "")
      ) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Evidence file is required for completed status",
          })
        );
        return;
      }

      // Process the payment data
      processDateRecord(data);
      calculateTotalDue(data);

      console.log("data=>", data._id);
      // Connect to the database and update the payment
      const db = await connectDB();
      const collection = db.collection("payments");
      const result = await collection.updateOne(
        { _id: new ObjectId(req.paymentId) },
        { $set: data }
      );

      // Respond with the updated payment
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Payment updated successfully",
          payment: result,
        })
      );
    });
  } catch (error) {
    console.error("An error occurred while updating the payment:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ error: "An error occurred while updating the payment" })
    );
  }
};
