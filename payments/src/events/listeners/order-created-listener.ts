import { Listener, OrderCreatedEvent, Subjects } from "@msticketingudemy/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        // Find the ticket that the order is reserving
        const order = Order.build({
            id: data.id,
            status: data.status,
            userId: data.userId,
            version: data.version,
            price: data.ticket.price
        });

        await order.save();

        // ack the message
        msg.ack();
    }


}
