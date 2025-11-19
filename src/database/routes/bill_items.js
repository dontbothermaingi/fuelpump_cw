const express = require("express");
const router = express.Router();
const db = require("../db");

// 1. Get all bill items
router.get("/", (req, res) => {
  db.query("SELECT * FROM Bill_Items", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 2. Get a single bill item
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM Bill_Items WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0)
      return res.status(404).json({ message: "Bill item not found" });

    res.json(results[0]);
  });
});

// 3. Create a bill item
router.post("/", (req, res) => {
  const items = req.body; // expecting an array of bill items

  if (!Array.isArray(items)) {
    return res.status(400).json({ message: "Expected an array of items" });
  }

  // 1️⃣ Insert all bill items
  const values = items.map((item) => [
    item.bill_id,
    item.pump_id,
    Number(item.litres),
    Number(item.price_per_litre),
  ]);

  const sqlInsert = `
    INSERT INTO Bill_Items (bill_id, pump_id, litres, price_per_litre)
    VALUES ?
  `;

  db.query(sqlInsert, [values], (err, result) => {
    if (err) {
      console.error("MySQL insert error:", err);
      return res.status(500).json({ error: err.message });
    }

    // 2️⃣ Add purchased litres to each pump
    items.forEach((item) => {
      const sqlUpdatePump = `
        UPDATE Pump
        SET litres_capacity = litres_capacity + ?
        WHERE id = ?
      `;
      db.query(sqlUpdatePump, [Number(item.litres), item.pump_id], (err) => {
        if (err) console.error("Error updating pump:", err);
      });
    });

    res.json({
      message: "Bill items inserted and pumps updated",
      inserted: result.affectedRows,
    });
  });
});

// 4. Update a bill item
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { bill_id, pump_id, litres, price_per_litre } = req.body;

  db.query(
    "UPDATE Bill_Items SET bill_id = ?, pump_id = ?, litres = ?, price_per_litre = ? WHERE id = ?",
    [bill_id, pump_id, litres, price_per_litre, id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.affectedRows === 0)
        return res.status(404).json({ message: "Bill item not found" });

      res.json({ message: "Bill item updated successfully" });
    }
  );
});

// 5. Delete a bill item
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM Bill_Items WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Bill item not found" });

    res.json({ message: "Bill item deleted successfully" });
  });
});

module.exports = router;
