const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");

// 1. Get all users
router.get("/", (req, res) => {
  db.query("SELECT * FROM Users", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// 2. Get a single user by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM Users WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.json(results[0]);
  });
});

// 3. Create a new user
router.post("/", async (req, res) => {
  const { name, role, email, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "Name & password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO Users (name, role, email, password) VALUES (?, ?, ?, ?)",
      [name, role, email, hashedPassword],
      (err, results) => {
        if (err) {
          console.log("MYSQL ERROR:", err);
          return res.status(500).json({ error: err.message });
        }

        res.json({
          id: results.insertId,
          name,
          role,
          email,
          message: "User created successfully",
        });
      }
    );
  } catch (err) {
    console.log("HASH ERROR:", err);
    res.status(500).json({ error: "Password hashing failed" });
  }
});

// 4. Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM Users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0)
        return res.status(401).json({ message: "User not found" });

      const user = results[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match)
        return res.status(401).json({ message: "Incorrect password" });

      res.json({ message: "Login successful", user });
    }
  );
});

// 5. Update a user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, role, password } = req.body;

  // Re-hash password if updated
  const hashed = password ? await bcrypt.hash(password, 10) : null;

  db.query(
    "UPDATE Users SET name = ?, role = ?, password = ? WHERE id = ?",
    [name, role, hashed, id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "User updated" });
    }
  );
});

// 6. Delete a user
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM Users WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "User deleted" });
  });
});

// Export router
module.exports = router;
