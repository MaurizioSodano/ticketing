import { Listener, NotFoundError, OrderCancelledEvent, OrderStatus, Subjects } from "@msticketingudemy/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;
    readonly queueGroupName = queueGroupName;
    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        // Find the ticket that the order is reserving
        console.log("looking for order.version:",data.version )
        const order = await Order.findByEvent({ id: data.id, version: data.version });

        if (!order) {
            throw new NotFoundError();
        }
        order.set({ status: OrderStatus.Cancelled });

        await order.save();

        // ack the message
        msg.ack();
    }


}
