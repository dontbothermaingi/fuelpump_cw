const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
const usersRouter = require("./routes/users");
const pumpsRouter = require("./routes/pumps");

app.use("/pumps", pumpsRouter);
app.use("/users", usersRouter);

app.listen(5000, () => console.log("Server running on port 5000"));
