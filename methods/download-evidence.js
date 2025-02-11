const { connectDB } = require("../db");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  try {
    const paymentId = req.paymentId;

    // Connect to the database
    const db = await connectDB();
    const paymentsCollection = db.collection("payments");
    const evidenceCollection = db.collection("evidence");

    // Find the payment
    const payment = await paymentsCollection.findOne({
      _id: new ObjectId(paymentId),
    });

    if (!payment || !payment.evidence_file_id) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Evidence file not found" }));
      return; // Ensure no further code is executed
    }

    // Find the evidence
    const evidence = await evidenceCollection.findOne({
      _id: new ObjectId(payment.evidence_file_id),
    });
    if (!evidence) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Evidence file not found" }));
      return; // Ensure no further code is executed
    }

    console.log("evidence=>", evidence);
    // Set headers and send the file
    res.writeHead(200, {
      "Content-Type": evidence.content_type,
      "Content-Disposition": `attachment; filename=${evidence.filename.replace(
        " ",
        "_"
      )}`,
    });
    res.end(Buffer.from(evidence.data.buffer)); // Convert evidence.data to Buffer
  } catch (error) {
    console.error("An error occurred while downloading the evidence:", error);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          error: "An error occurred while downloading the evidence",
        })
      );
    }
  }
};
