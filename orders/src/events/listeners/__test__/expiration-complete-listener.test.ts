import { ExpirationCompleteListener } from "../expiration-complete-listener"
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteEvent, OrderStatus } from "@mauriziosodano/ticketing-common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";

const setup = async () => {
    // create an instance of the listener
    const listener = new ExpirationCompleteListener(natsWrapper.client);


    // create a fake ticket and order

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 10,
        title: "concert"
    })
    await ticket.save();
    const order = Order.build({
        status: OrderStatus.Created,
        userId: "fdsfd",
        expiresAt: new Date(),
        ticket,
    });

    await order.save();

  

    // create a fake data event
    const data: ExpirationCompleteEvent["data"] = {
        orderId: order.id
    }
    // create a fake message object

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, order, ticket };


}
it("updates the order status to cancelled", async () => {
    // setup
    const { listener, data, msg, order } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id).exec();

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

});

it("emit an OrderCancelled event", async () => {
    // setup
    const { listener, data, msg, order } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const eventData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(eventData.id).toEqual(order.id);

});
it("acks the messages", async () => {
    // setup
    const { listener, data, msg } = await setup();
    // call the onMessage function with the fata object + message object
    await listener.onMessage(data, msg);
    // write assertions to make sure a ack message is sent
    expect(msg.ack).toHaveBeenCalled();

});

