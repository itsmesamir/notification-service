import { WebSocketServer, WebSocket } from "ws";
import { EventEmitter } from "events";
import logger from "../middleware/logger";
import dotenv from "dotenv";
import subscriptions from "../models/subscription";

dotenv.config();

const wss = new WebSocketServer({ port: Number(process.env.WS_PORT) || 3001 });
const eventEmitter = new EventEmitter();

// Active WebSocket subscriptions
const activeWebSocketSubscriptions: Record<string, Set<WebSocket>> = {};

wss.on("connection", (ws) => {
  logger.info("New client connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      const { action, eventType, userId } = data;

      if (action === "subscribe") {
        const isUserSubscribed = subscriptions.some(
          (sub) => sub.userId === userId && sub.eventType === eventType
        );

        if (!isUserSubscribed) {
          logger.warn(
            `User ${userId} is NOT subscribed to ${eventType}. Ignoring WebSocket subscription.`
          );
          return;
        }

        if (!activeWebSocketSubscriptions[eventType]) {
          activeWebSocketSubscriptions[eventType] = new Set();
        }

        activeWebSocketSubscriptions[eventType].add(ws);
        logger.info(
          `Client subscribed to ${eventType} via WebSocket: active ${JSON.stringify(
            activeWebSocketSubscriptions
          )}`
        );
      }
    } catch (error) {
      logger.error("Invalid WebSocket message format");
    }
  });

  ws.on("close", () => {
    logger.info("Client disconnected");
    Object.values(activeWebSocketSubscriptions).forEach((clients) =>
      clients.delete(ws)
    );
  });
});

// Function to notify active WebSocket subscribers
export const notifySubscribers = (
  eventType: string,
  data: { userId: string; message: string }
) => {
  if (activeWebSocketSubscriptions[eventType]) {
    activeWebSocketSubscriptions[eventType].forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ eventType, data }));
      }
    });
  }
};

eventEmitter.on("subscriptionAdded", ({ eventType, userId }) => {
  notifySubscribers(eventType, { userId, message: "New subscription added" });
});

eventEmitter.on("subscriptionRemoved", ({ eventType, userId }) => {
  notifySubscribers(eventType, { userId, message: "Subscription removed" });
});

// Mock event generation every 30 sec
setInterval(() => {
  // add user1 to price_update subscription if not already subscribed
  if (
    !subscriptions.some(
      (sub) => sub.userId === "user1" && sub.eventType === "price_update"
    )
  ) {
    subscriptions.push({ userId: "user1", eventType: "price_update" });
  }

  eventEmitter.emit("subscriptionAdded", {
    eventType: "price_update",
    userId: "user1",
  });
}, 30000);

export { wss, eventEmitter };
