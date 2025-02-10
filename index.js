const http = require("http");
const getPayments = require("./methods/get-payments");
const postPayment = require("./methods/post-payment.js");
const putPayment = require("./methods/put-payment.js");
const deletePayment = require("./methods/delete-payment");
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
  switch (req.method) {
    case "GET":
      getPayments(req, res);
      break;
    case "POST":
      postPayment(req, res);
      break;
    case "PUT":
      putPayment(req, res);
      break;
    case "DELETE":
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
