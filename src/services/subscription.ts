import subscriptions from "../models/subscription";
import { eventEmitter } from "../websocket/websocket";

export const addSubscription = (userId: string, eventType: string) => {
  if (
    !subscriptions.some(
      (sub) => sub.userId === userId && sub.eventType === eventType
    )
  ) {
    subscriptions.push({ userId, eventType });

    eventEmitter.emit("subscriptionAdded", {
      eventType,
      userId,
    });
  }

  return { message: "Subscription added", subscriptions };
};

export const removeSubscription = (userId: string, eventType: string) => {
  const index = subscriptions.findIndex(
    (sub) => sub.userId === userId && sub.eventType === eventType
  );
  if (index !== -1) {
    subscriptions.splice(index, 1);

    eventEmitter.emit("subscriptionRemoved", { eventType, userId });
  }

  return { message: "Subscription removed", subscriptions };
};
