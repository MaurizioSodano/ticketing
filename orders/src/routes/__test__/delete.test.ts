import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

import { Order, OrderStatus } from "../../models/order";



it("can only be deleted if the user is signed in",
    async () => {
        await request(app)
            .delete("/api/orders/fdfdfdfdf")
            .send({})
            .expect(401);
    });


it("returns an error if a user tries to delete another users order", async () => {
    // Create a ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 10,
    });
    await ticket.save();

    const userOne = global.signin();
    const userTwo = global.signin();
    // make a request to build an order with this ticket

    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", userOne)
        .send({ ticketId: ticket.id })
        .expect(201);

    // make request to fetch the order

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", userTwo)
        .send()
        .expect(401);

});


it("marks an order as cancelled",
    async () => {

        // Create a ticket
        const ticket = Ticket.build({
            title: "concert",
            price: 10,
        });
        await ticket.save();

        const user = global.signin();
        // make a request to create an order
        const { body: order } = await request(app)
            .post("/api/orders")
            .set("Cookie", user)
            .send({ ticketId: ticket.id })
            .expect(201);

        // make a request to cancel the order


        await request(app)
            .delete(`/api/orders/${order.id}`)
            .set("Cookie", user)
            .send({})
            .expect(204);

        // exectation to make sure the order is cancelled
        const updatedOrder = await Order.findById(order.id).exec();

        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

    });

it.todo("emits an order cancelled event")