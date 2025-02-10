const http = require("http");
const getPayments = require("./methods/get-payments");
const postPayment = require("./methods/post-payment.js");
const putPayment = require("./methods/put-payment.js");
const deletePayment = require("./methods/delete-payment");
const uploadCSV = require("./methods/upload-csv");
require("dotenv").config();

const PORT = process.env.PORT || 5001;

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "http://your-frontend-uri.com"); // Replace with your frontend URI
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
    case req.method === "GET" && req.url === "/getPayments":
      getPayments(req, res);
      break;
    case req.method === "POST" && req.url === "/uploadCSV":
      uploadCSV(req, res);
      break;
    case req.method === "POST" && req.url === "/createPayment":
      postPayment(req, res);
      break;
    case req.method === "PUT" && req.url === "/updatePayment":
      putPayment(req, res);
      break;
    case req.method === "DELETE" && req.url === "/deletePayment":
      deletePayment(req, res);
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
