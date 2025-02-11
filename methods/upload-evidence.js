const { connectDB } = require("../db");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const { parse } = require("url");

// Configure storage for uploaded files
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("File type not allowed"), false);
    }
    cb(null, true);
  },
}).single("uploadFile");

module.exports = async (req, res) => {
  try {
    const parsedUrl = parse(req.url, true);
    const paymentId = parsedUrl.pathname.split("/")[2];
    console.log("Payment ID:", paymentId);

    // Handle file upload
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "File type not allowed" }));
        return;
      }

      // Connect to the database
      const db = await connectDB();
      const paymentsCollection = db.collection("payments");
      const evidenceCollection = db.collection("evidence");

      // Check if payment exists
      const payment = await paymentsCollection.findOne({
        _id: new ObjectId(paymentId),
      });
      if (!payment) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Payment not found" }));
        return;
      }

      // Create evidence document
      const evidenceDoc = {
        payment_id: paymentId,
        filename: req.file.originalname,
        content_type: req.file.mimetype,
        data: req.file.buffer,
        uploaded_at: new Date(),
      };

      // Store in evidence collection
      const result = await evidenceCollection.insertOne(evidenceDoc);

      // Update payment with evidence reference
      await paymentsCollection.updateOne(
        { _id: new ObjectId(paymentId) },
        { $set: { evidence_file_id: result.insertedId.toString() } }
      );

      // Respond with success message
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Evidence file uploaded successfully",
          evidence_id: result.insertedId.toString(),
        })
      );
    });
  } catch (error) {
    console.error("An error occurred while uploading evidence:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ error: "An error occurred while uploading evidence" })
    );
  }
};
