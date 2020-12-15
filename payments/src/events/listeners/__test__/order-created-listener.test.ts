import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@msticketingudemy/common";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";

import { Order } from "../../../models/order";
import { Message } from "node-nats-streaming";


const setup = async () => {
    // create a listener
    const listener = new OrderCreatedListener(natsWrapper.client);



    // create a fake data event

    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: "dfdsgf",
        expiresAt: "fdfdf",
        version: 0,
        ticket: {
            id: "fdsfgr",
            price: 20
        }

    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg };

}


it("sets the orderId of the ticket", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id).exec();
    expect(order!.price).toEqual(data.ticket.price);
    expect(order!.id).toEqual(data.id);

})


it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    // write assertions to make sure a ack message is sent
    expect(msg.ack).toHaveBeenCalled();

});

