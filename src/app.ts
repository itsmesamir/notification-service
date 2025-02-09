import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import subscriptionRoutes from "./routes/subscription";
import { eventEmitter } from "./websocket/websocket";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/api", subscriptionRoutes);

app.get("/test-notify", (req, res) => {
  eventEmitter.emit("subscriptionAdded", {
    eventType: "price_update",
    userId: "user123",
  });
  res.send("Notification sent");
});

export default app;
