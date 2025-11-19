const express = require("express");
const router = express.Router();
const db = require("../db");

//Get all fuel transactions
router.get("/", (req, res) => {
  db.query("SELECT * FROM Fuel_Transaction", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

//Get a single transaction by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM Fuel_Transaction WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0)
        return res.status(404).json({ message: "Transaction not found" });
      res.json(results[0]);
    }
  );
});

//Create a new transaction (and update pump stock)
router.post("/", (req, res) => {
  const { pump_id, user_id, vehicle_number, litres, price_per_liter } =
    req.body;

  if (!pump_id || !litres || !price_per_liter) {
    return res
      .status(400)
      .json({ message: "Pump, litres, and price are required" });
  }

  const sqlInsert = `
    INSERT INTO Fuel_Transaction (pump_id, user_id, vehicle_number, litres, price_per_liter)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sqlInsert,
    [pump_id, user_id || null, vehicle_number || null, litres, price_per_liter],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // Update pump stock: subtract sold litres
      const sqlUpdatePump = `
        UPDATE Pump
        SET litres_capacity = litres_capacity - ?
        WHERE id = ?
      `;

      db.query(sqlUpdatePump, [litres, pump_id], (err2) => {
        if (err2) console.error("Error updating pump:", err2);
        res.json({
          message: "Transaction added and pump updated",
          transaction_id: result.insertId,
        });
      });
    }
  );
});

//Update a transaction
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { pump_id, user_id, vehicle_number, litres, price_per_liter } =
    req.body;

  const sqlUpdate = `
    UPDATE Fuel_Transaction
    SET pump_id = ?, user_id = ?, vehicle_number = ?, litres = ?, price_per_liter = ?
    WHERE id = ?
  `;

  db.query(
    sqlUpdate,
    [pump_id, user_id, vehicle_number, litres, price_per_liter, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Transaction updated" });
    }
  );
});

//Delete a transaction
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM Fuel_Transaction WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Transaction deleted" });
  });
});

module.exports = router;
