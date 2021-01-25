import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent } from "@mauriziosodano/ticketing-common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from "mongoose";

import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";


const setup = async () => {
    // create a listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    // create and save a ticket
    const orderId = mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: "concert",
        price: 20,
        userId: "fdgfdg",
    });

    ticket.set({ orderId });

    await ticket.save();

    // create a fake data event

    const data: OrderCancelledEvent["data"] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg, orderId };

}


it("updates the ticket, publishes an event, and acks the message", async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id).exec();

    expect(updatedTicket!.orderId).not.toBeDefined();


    // write assertions to make sure a ack message is sent
    expect(msg.ack).toHaveBeenCalled();


    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(ticketUpdatedData.orderId).toEqual(undefined);
})
