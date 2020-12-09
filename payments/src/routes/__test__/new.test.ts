import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment"

jest.mock("../../stripe");

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
        userId
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

it("returns a 201 with valid inputs", async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Created,
    })
    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin(userId))
        .send({
            token: "tok_visa",
            orderId: order.id
        })
        .expect(201);

    
    const chargedOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
   
    expect(chargedOptions.source).toEqual('tok_visa');
    expect(chargedOptions.amount).toEqual(order.price * 100);
    expect(chargedOptions.currency).toEqual('eur');


    const chargeResult = await (stripe.charges.create as jest.Mock).mock
        .results[0].value;


    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: chargeResult.id,
    }).exec();

    expect(payment).not.toBeNull();
    expect(payment!.orderId).toEqual(order.id);
    expect(payment!.stripeId).toEqual(chargeResult.id);
})