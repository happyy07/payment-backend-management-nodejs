module.exports = (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.write(JSON.stringify({ title: "Payments", message: "Update Payments" }));
  res.end();
};
