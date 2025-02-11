const http = require("http");
const getPayments = require("./methods/get-payments");
const postPayment = require("./methods/post-payment.js");
const putPayment = require("./methods/put-payment.js");
const deletePayment = require("./methods/delete-payment");
const uploadCSV = require("./methods/upload-csv");
const uploadEvidence = require("./methods/upload-evidence.js");
const downloadEvidence = require("./methods/download-evidence.js");
require("dotenv").config();

const PORT = process.env.PORT || 5001;

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // Replace with your frontend URI
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

  if (req.method === "OPTIONS") {
    // Handle preflight request
    res.writeHead(204);
    res.end();
    return;
  }

  // Route handling
  switch (true) {
    case req.method === "GET" && req.url.includes("/payments/getAllPayments"):
      getPayments(req, res);
      break;
    case req.method === "POST" && req.url === "/payments/uploadCSV":
      uploadCSV(req, res);
      break;
    case req.method === "POST" && req.url === "/payments/createPayment":
      postPayment(req, res);
      break;
    case req.method === "PUT" &&
      /^\/payments\/updatePayment\/([^\/]+)$/.test(req.url):
      const paymentId = req.url.match(
        /^\/payments\/updatePayment\/([^\/]+)$/
      )[1];
      req.paymentId = paymentId; // Attach paymentId to the request object
      putPayment(req, res);
      break;
    case req.method === "DELETE" &&
      /^\/payments\/deletePayment\/([^\/]+)$/.test(req.url):
      const deletePaymentId = req.url.match(
        /^\/payments\/deletePayment\/([^\/]+)$/
      )[1];
      req.paymentId = deletePaymentId; // Attach paymentId to the request object
      deletePayment(req, res);
      break;
    case req.method === "POST" &&
      /^\/payments\/[^\/]+\/evidence$/.test(req.url):
      uploadEvidence(req, res);
      break;
    case req.method === "GET" &&
      /^\/payments\/[^\/]+\/downloadEvidence$/.test(req.url):
      const payment_Id = req.url.match(
        /^\/payments\/([^\/]+)\/downloadEvidence$/
      )[1];
      req.paymentId = payment_Id; // Attach paymentId to the request object
      downloadEvidence(req, res);
      break;
    default:
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.write(
        JSON.stringify({ title: "Not Found", message: "Route not found" })
      );
      res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
