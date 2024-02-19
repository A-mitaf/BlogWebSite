const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library

const app = express();
const port = 3000;

const users = [];
const secretKey = 'yourSecretKey'; // Replace with a secure secret key

app.use(express.json());

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = users.find((data) => email === data.email);
    if (findUser) {
      res.status(400).send("Email already exists!");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });
    res.status(201).send("Registered successfully!");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = users.find((data) => email === data.email);
    if (!findUser) {
      res.status(400).send("Wrong email or password!");
    }
    const passwordMatch = await bcrypt.compare(password, findUser.password);
    if (passwordMatch) {
      const token = jwt.sign({ email: findUser.email }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ token: token, message: "Logged in successfully!" });
    } else {
      res.status(400).send("Wrong email or password!");
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).send("Access denied!");
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token!");
    }
    req.user = user;
    next();
  });
};

// Example of protected route
app.get("/admin", authenticateToken, (req, res) => {
  // Only accessible with a valid JWT
  res.status(200).send("Admin route accessed!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
