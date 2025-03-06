const http = require("http");
const getPayments = require("./methods/get-payments.js");
const postPayment = require("./methods/post-payment.js");
const putPayment = require("./methods/put-payment.js");
const deletePayment = require("./methods/delete-payment.js");
const uploadCSV = require("./methods/upload-csv.js");
const downloadEvidence = require("./methods/download-evidence.js");
const createUser = require("./methods/create-user.js");
const loginUser = require("./methods/login-user.js");
const authenticateToken = require("./middleware/auth.js"); // Import the middleware
// require("dotenv").config();

const PORT = process.env.PORT || 5001;

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://payment-management.codewithme.click"
  ); // Replace with your frontend URI
  // Allow specific headers & credentials
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Route handling
  switch (true) {
    case req.method === "GET" && req.url === "/health":
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("OK");
      break;
    case req.method === "POST" && req.url === "/users/loginUser":
      loginUser(req, res);
      break;
    case req.method === "POST" && req.url === "/users/createUser":
      createUser(req, res);
      break;
    case req.method === "GET" && req.url.includes("/payments/getAllPayments"):
      authenticateToken(req, res, () => getPayments(req, res));
      break;
    case req.method === "POST" && req.url === "/payments/uploadCSV":
      authenticateToken(req, res, () => uploadCSV(req, res));
      break;
    case req.method === "POST" && req.url === "/payments/createPayment":
      authenticateToken(req, res, () => postPayment(req, res));
      break;
    case req.method === "PUT" &&
      /^\/payments\/updatePayment\/([^\/]+)$/.test(req.url):
      authenticateToken(req, res, () => {
        const paymentId = req.url.match(
          /^\/payments\/updatePayment\/([^\/]+)$/
        )[1];
        req.paymentId = paymentId; // Attach paymentId to the request object
        putPayment(req, res);
      });
      break;
    case req.method === "DELETE" &&
      /^\/payments\/deletePayment\/([^\/]+)$/.test(req.url):
      authenticateToken(req, res, () => {
        const deletePaymentId = req.url.match(
          /^\/payments\/deletePayment\/([^\/]+)$/
        )[1];
        req.paymentId = deletePaymentId; // Attach paymentId to the request object
        deletePayment(req, res);
      });
      break;
    case req.method === "GET" &&
      /^\/payments\/([^\/]+)\/downloadEvidence$/.test(req.url):
      authenticateToken(req, res, () => {
        const evidencePaymentId = req.url.match(
          /^\/payments\/([^\/]+)\/downloadEvidence$/
        )[1];
        req.params = { paymentId: evidencePaymentId }; // Attach paymentId to the request object
        downloadEvidence(req, res);
      });
      break;
    default:
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ title: "Not Found", message: "Route not found" })
      );
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
