import request from "supertest";
import app from "../app";

describe("Subscription API", () => {
  test("should subscribe to an event", async () => {
    const res = await request(app)
      .post("/api/subscribe")
      .send({ userId: "user1", eventType: "price_update" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Subscription added");
  });

  test("should unsubscribe from an event", async () => {
    const res = await request(app)
      .post("/api/unsubscribe")
      .send({ userId: "user1", eventType: "price_update" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Subscription removed");
  });
});
