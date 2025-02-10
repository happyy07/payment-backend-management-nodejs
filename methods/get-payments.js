const { connectDB } = require("../db");
const {
  processDateRecord,
  updatePaymentStatus,
  calculateTotalDue,
} = require("../utils/commonUtils");
const url = require("url");

module.exports = async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("payments");
    // Create a text index on payee_first_name and payee_last_name
    // await collection.createIndex({
    //   payee_first_name: "text",
    // });

    // Parse query parameters for filtering, searching, and paging
    const parsedUrl = url.parse(req.url, true);
    console.log("parsedUrl", parsedUrl);
    const { filter, search, page = 1, limit = 10 } = parsedUrl.query;
    const query = {};

    if (filter) {
      // Add filter conditions to the query
      Object.assign(query, JSON.parse(filter));
    }

    // if (search) {
    //   // Add search conditions to the query
    //   // query.$text = { $search: search };
    // }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { payee_first_name: { $regex: searchRegex } },
        { payee_last_name: { $regex: searchRegex } },
        { payee_email: { $regex: searchRegex } },
      ];
    }

    const skip = (page - 1) * limit;

    // Fetch payments from the database with filtering, searching, and paging
    const payments = await collection
      .find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    console.log("happy payments", payments);
    // Process each payment record
    payments.forEach((record) => {
      processDateRecord(record);
      updatePaymentStatus(record);
      calculateTotalDue(record);
    });

    // Respond with the processed payments
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ total: payments.length, data: payments }));
  } catch (error) {
    console.error("An error occurred while fetching payments:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ error: "An error occurred while fetching payments" })
    );
  }
};
