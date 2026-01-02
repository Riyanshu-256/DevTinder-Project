require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

/* ---------- CORS (CORRECT WAY) ---------- */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ---------- MIDDLEWARE ---------- */
app.use(express.json());
app.use(cookieParser());

/* ---------- ROUTES ---------- */
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/profile"));
app.use("/request", require("./routes/request"));
app.use("/", require("./routes/user"));

/* ---------- SERVER ---------- */
connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => console.error(err));
