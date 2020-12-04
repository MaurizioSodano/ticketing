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
        const { id, ticket } = data;
        const currentTicket = await Ticket.findById(ticket.id).exec();

        // If no ticket, throw an error
        if (!currentTicket) {
            throw new Error("Ticket not found");
        }

        // Mark the ticket as being reserved by setting its orderId
        currentTicket.set({ orderId: id });

        // Save the ticket
        try {
            await currentTicket.save();
            await new TicketUpdatedPublisher(this.client).publish({
                id: currentTicket.id,
                price: currentTicket.price,
                title: currentTicket.title,
                userId: currentTicket.userId,
                version: currentTicket.version,
                orderId: currentTicket.orderId
            });
        } catch (error) {
            throw new Error("Ticket out of version");
        }


        // ack the message
        msg.ack();
    }


}
