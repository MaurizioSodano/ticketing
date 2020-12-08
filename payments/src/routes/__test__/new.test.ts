import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";

it("returns a 404 when an order does not exist", async () => {
    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin())
        .send({
            token: "fdfsfd",
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
})

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
    // create a fake order
    const userId = mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Created,
        version: 0,
        userId: userId
    })

    await order.save();
    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin())
        .send({
            token: "fdfsfd",
            orderId: order.id
        })
        .expect(401);


})


it("returns a 400 when the order has been cancelled", async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Cancelled,
        version: 0,
        userId: userId
    })
    await order.save();
    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin(userId))
        .send({
            token: "fdfsfd",
            orderId: order.id
        })
        .expect(400);

})