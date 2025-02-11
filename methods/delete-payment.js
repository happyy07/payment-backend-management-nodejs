const { connectDB } = require("../db");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  try {
    const paymentId = req.paymentId;
    // Connect to the database
    const db = await connectDB();
    const collection = db.collection("payments");

    // Delete the payment
    const result = await collection.deleteOne({ _id: new ObjectId(paymentId) });
    console.log("result=>", result);

    if (result.deletedCount === 0) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Payment not found" }));
      return;
    }

    // Respond with success message
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Payment deleted successfully" }));
  } catch (error) {
    console.error("An error occurred while deleting the payment:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ error: "An error occurred while deleting the payment" })
    );
  }
};
