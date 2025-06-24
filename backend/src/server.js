import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import OTPRoutes from "./routes/OTProutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // nếu bạn sử dụng cookie hoặc auth
  })
);

app.use(express.json()); // this middleware will parse JSON bodies: req.body

// our simple custom middleware
// app.use((req, res, next) => {
//   console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
//   next();
// });

app.use("/api/notes", notesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/otp", OTPRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running in development");
  });
}



connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
