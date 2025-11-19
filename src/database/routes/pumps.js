const express = require("express");
const router = express.Router();
const db = require("../db");

// 1. GET all pumps
router.get("/", (req, res) => {
  db.query("SELECT * FROM Pump", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 2. GET a single pump
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM Pump WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res.status(404).json({ message: "Pump not found" });
    }

    res.json(results[0]);
  });
});

//3. CREATE pump
router.post("/", (req, res) => {
  const {
    id,
    pump_name,
    pump_reading,
    type_of_fuel,
    litres_capacity,
    price_per_litre,
  } = req.body;

  if (!id || !pump_name || !type_of_fuel || !price_per_litre) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  db.query(
    `INSERT INTO Pump 
    (id, pump_name, pump_reading, type_of_fuel, litres_capacity, price_per_litre)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id,
      pump_name,
      pump_reading || 0,
      type_of_fuel,
      litres_capacity || 0,
      price_per_litre,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      res.json({
        message: "Pump created successfully",
        pump: {
          id,
          pump_name,
          pump_reading,
          type_of_fuel,
          litres_capacity,
          price_per_litre,
        },
      });
    }
  );
});

// 4. UPDATE pump
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const {
    pump_name,
    pump_reading,
    type_of_fuel,
    litres_capacity,
    price_per_litre,
  } = req.body;

  db.query(
    `UPDATE Pump SET 
      pump_name = ?, 
      pump_reading = ?, 
      type_of_fuel = ?, 
      litres_capacity = ?, 
      price_per_litre = ?
     WHERE id = ?`,
    [
      pump_name,
      pump_reading,
      type_of_fuel,
      litres_capacity,
      price_per_litre,
      id,
    ],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Pump not found" });
      }

      res.json({ message: "Pump updated successfully" });
    }
  );
});

//5. DELETE pump
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM Pump WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Pump not found" });
    }

    res.json({ message: "Pump deleted successfully" });
  });
});

module.exports = router;
