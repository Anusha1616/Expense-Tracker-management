const express = require("express");
const cors = require("cors");
require("dotenv").config();
// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log(
//   "APP PASSWORD LENGTH:",
//   process.env.EMAIL_APP_PASSWORD
//     ? process.env.EMAIL_APP_PASSWORD.length
//     : "NOT FOUND"
// );

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

const app = express();

app.use(cors());  
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Expense Tracker Backend is running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();