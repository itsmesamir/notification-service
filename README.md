# Real-Time Notification System

This is a backend service built using Node.js and TypeScript that allows users to subscribe to certain events and receive real-time notifications when those events occur. The system supports WebSocket connections for real-time communication and RESTful APIs to manage subscriptions.

## Features

- **API to Manage Subscriptions**: RESTful endpoints to add and remove subscriptions.
- **Event Emitter System**: Simulated event triggering to notify subscribers.
- **Real-Time Communication**: WebSocket to push notifications to subscribed clients.
- **TypeScript**: Strict typing for API requests, responses, and event handling.
- **Error Handling & Logging**: Detailed logging and error handling for debugging.

## Technologies Used

- **Node.js** (with Express)
- **TypeScript** for strict typing
- **WebSocket** for real-time notifications
- **EventEmitter** (Node.js native) for event-driven architecture
- **In-memory storage** (for simplicity, no external DB like Redis used in this implementation)

## Setup & Installation

1. Clone the repository:
   ```bash
   git clone <repo_url>
   cd <project_folder>
   ```
2. Install dependencies:

```bash
npm install
```

## Set up environment variables in a .env file:

```env
WS_PORT=3001  # Port for WebSocket server
```

## Run the application:

```bash
yarn start
```

This will start the server on:

- REST API: [http://localhost:3000](http://localhost:3000)
- WebSocket server: [ws://localhost:3001](ws://localhost:3001)

## API Endpoints

### 1. Add Subscription

- **Method:** POST
- **URL:** /api/subscriptions

**Body:**

```json
{
  "userId": "user123",
  "eventType": "price_update"
}
```

**Response:**

- 200 OK: Subscription added successfully.
- 400 Bad Request: Invalid data or user already subscribed.

### 2. Remove Subscription

- **Method:** DELETE
- **URL:** /api/subscriptions

**Body:**

```json
{
  "userId": "user123",
  "eventType": "price_update"
}
```

**Response:**

- 200 OK: Subscription removed successfully.
- 404 Not Found: Subscription not found.

## WebSocket Communication

### WebSocket URL

- WebSocket: [ws://localhost:3001](ws://localhost:3001)

### Sending a Subscription Request

To subscribe to an event (e.g., "price_update"), send a message via WebSocket:

```json
{
  "action": "subscribe",
  "userId": "user123",
  "eventType": "price_update"
}
```

### Broadcasting Events

The system will broadcast events to subscribed clients. An example event message could look like:

```json
{
  "eventType": "price_update",
  "data": {
    "message": "New price update"
  }
}
```

Clients subscribed to the "price_update" event will receive this data in real-time.

### Event Simulation

You can simulate events being emitted using the event emitter system, such as every 5 seconds (or as configured in the code).

```typescript
setInterval(() => {
  eventEmitter.emit("subscriptionAdded", {
    eventType: "price_update",
    userId: "user1",
  });
}, 5000);
```

## Testing the API Using Postman

### Add a Subscription:

- **Method:** POST
- **URL:** [http://localhost:3000/api/subscriptions](http://localhost:3000/api/subscriptions)
- **Body:**

```json
{
  "userId": "user123",
  "eventType": "price_update"
}
```

**Expected Response:** 200 OK

### Remove a Subscription:

- **Method:** DELETE
- **URL:** [http://localhost:3000/api/subscriptions](http://localhost:3000/api/subscriptions)
- **Body:**

```json
{
  "userId": "user123",
  "eventType": "price_update"
}
```

**Expected Response:** 200 OK

### WebSocket Subscription:

Use Postman or any WebSocket client to connect to [ws://localhost:3001](ws://localhost:3001).

Send the subscription message:

```json
{
  "action": "subscribe",
  "userId": "user123",
  "eventType": "price_update"
}
```

You should receive the broadcasted message when an event is emitted (e.g., "price_update").

## Project Structure

```bash
src/
  ├── controllers/                # Handles API requests
  ├── events/                     # Event handling logic
  ├── models/                     # Data models (subscriptions)
  ├── services/                   # WebSocket and event emitter services
  ├── utils/                      # Utility functions
  ├── app.ts                      # Main entry point
  ├── logger.ts                   # Logging setup
  └── ws.ts                       # WebSocket server and event handling
```

## Scalability Considerations

### Horizontal Scaling

You can scale this service horizontally by deploying multiple instances and using a load balancer (e.g., Nginx or AWS Elastic Load Balancer).

### Message Queues

For high throughput and decoupling, consider using message queues like RabbitMQ or Kafka.

### Redis Pub/Sub

For efficient message broadcasting across instances, use Redis Pub/Sub.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
