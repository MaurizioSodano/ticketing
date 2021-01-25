import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@mauriziosodano/ticketing-common";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";

import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";


const setup = async () => {
    // create a listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // create and save a ticket
    const ticket = Ticket.build({
        title: "concert",
        price: 20,
        userId: "fdgfdg"
    });

    await ticket.save();

    // create a fake data event

    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: "dfdsgf",
        expiresAt: "fdfdf",
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }

    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg };

}


it("sets the orderId of the ticket", async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id).exec();

    expect(updatedTicket!.orderId).toEqual(data.id);

})


it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    // write assertions to make sure a ack message is sent
    expect(msg.ack).toHaveBeenCalled();

});

it("publishes a ticket updated event", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();



    console.log((natsWrapper.client.publish as jest.Mock).mock.calls);

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(ticketUpdatedData.orderId).toEqual(data.id);



})