import { Listener, OrderCreatedEvent, Subjects } from "@msticketingudemy/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        // Find the ticket that the order is reserving
        const { id } = data;
        const ticket = await Ticket.findById(data.ticket.id).exec();

        // If no ticket, throw an error
        if (!ticket) {
            throw new Error("Ticket not found");
        }

        // Mark the ticket as being reserved by setting its orderId
        ticket.set({ orderId: id });

        // Save the ticket
        try {
            await ticket.save();
            await new TicketUpdatedPublisher(this.client).publish({
                id: ticket.id,
                price: ticket.price,
                title: ticket.title,
                userId: ticket.userId,
                version: ticket.version,
                orderId: ticket.orderId
            });
        } catch (error) {
            throw new Error("Ticket out of version");
        }


        // ack the message
        msg.ack();
    }


}
