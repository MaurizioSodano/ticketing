import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent, OrderStatus } from "@mauriziosodano/ticketing-common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from "mongoose";

import { Order } from "../../../models/order";
import { Message } from "node-nats-streaming";


const setup = async () => {
    // create a listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Created,
        version: 0,
        userId: "fefrr"
    })

    await order.save();

    // create a fake data event

    const data: OrderCancelledEvent["data"] = {
        id: order.id,
        version: 1,
        ticket: {
            id: mongoose.Types.ObjectId().toHexString()
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
    expect(order!.status).toEqual(OrderStatus.Cancelled);
    expect(order!.id).toEqual(data.id);

})


it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    // write assertions to make sure a ack message is sent
    expect(msg.ack).toHaveBeenCalled();

});

