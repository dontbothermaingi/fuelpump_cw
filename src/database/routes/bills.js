const express = require("express");
const router = express.Router();
const db = require("../db");

// 1. Get all bills
router.get("/", (req, res) => {
  db.query("SELECT * FROM Bill", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 2. Get a single bill
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM Bill WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0)
      return res.status(404).json({ message: "Bill not found" });

    res.json(results[0]);
  });
});

// 3. Create a bill
router.post("/", (req, res) => {
  const { user_id, vendor_name, vendor_email, total_amount } = req.body;

  db.query(
    "INSERT INTO Bill (user_id, vendor_name, vendor_email, total_amount) VALUES (?, ?, ?, ?)",
    [user_id, vendor_name, vendor_email, total_amount || 0],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      res.json({
        message: "Bill created successfully",
        bill: {
          id: results.insertId,
          user_id,
          vendor_name,
          vendor_email,
          total_amount,
        },
      });
    }
  );
});

// 4. Update a bill
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { user_id, vendor_name, vendor_email, total_amount } = req.body;

  db.query(
    "UPDATE Bill SET user_id = ?, vendor_name = ?, vendor_email = ?, total_amount = ? WHERE id = ?",
    [user_id, vendor_name, vendor_email, total_amount, id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.affectedRows === 0)
        return res.status(404).json({ message: "Bill not found" });

      res.json({ message: "Bill updated successfully" });
    }
  );
});

// 5. Delete a bill
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM Bill WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Bill not found" });

    res.json({ message: "Bill deleted successfully" });
  });
});

module.exports = router;
