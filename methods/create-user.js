const { connectDB } = require("../db");
const { userSchema } = require("../model/paymentSchema");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  try {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const data = JSON.parse(body);

      // Validate the user data
      const { error } = userSchema.validate(data);
      if (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.details[0].message }));
        return;
      }

      // Connect to the database
      const db = await connectDB();
      const collection = db.collection("users");

      // Check if the email already exists
      const existingUser = await collection.findOne({ email: data.email });
      if (existingUser) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Email already exists" }));
        return;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Prepare the user data for insertion
      const userData = {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      };

      // Insert the user into the database
      const result = await collection.insertOne(userData);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "User created successfully",
          user: result.insertedId,
        })
      );
    });
  } catch (error) {
    console.error("An error occurred while creating the user:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ error: "An error occurred while creating the user" })
    );
  }
};
