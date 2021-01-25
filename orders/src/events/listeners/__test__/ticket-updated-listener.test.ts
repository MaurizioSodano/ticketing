import { TicketUpdatedListener } from "../ticket-updated-listener"
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@mauriziosodano/ticketing-common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";


const setup = async () => {
    // create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create and save a ticket

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        title: "concert"
    });

    await ticket.save();

    // create a fake data event
    const data: TicketUpdatedEvent["data"] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: "New Concert",
        price: 1440,
        userId: new mongoose.Types.ObjectId().toHexString()
    }
    // create a fake message object

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg };


}
it("finds, updates, and saves a ticket", async () => {
    // setup
    const { listener, data, msg, ticket } = await setup();

    // call the onMessage function with the fata object + message object
    await listener.onMessage(data, msg);
    // write assertions to make sure a ticket was created!

    const updatedTicket = await Ticket.findById(ticket.id).exec();
    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);

});

it("acks the messages", async () => {
    // setup
    const { listener, data, msg } = await setup();
    // call the onMessage function with the fata object + message object
    await listener.onMessage(data, msg);
    // write assertions to make sure a ack message is sent
    expect(msg.ack).toHaveBeenCalled();

});

it("test out of order event", async () => {
    const { listener, data, msg } = await setup();

    //set the event a version in the future
    data.version = 10;

    // call the onMessage function with the fata object + message object
    try {
        await listener.onMessage(data, msg);
    } catch (error) {

    }

    // write assertions to make sure a ack message is sent
    expect(msg.ack).not.toHaveBeenCalled();




})

