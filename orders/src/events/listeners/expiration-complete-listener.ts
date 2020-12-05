import { Message } from "node-nats-streaming";
import { Subjects, Listener, ExpirationCompleteEvent, NotFoundError, OrderStatus } from "@msticketingudemy/common";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";
import { OrderCreatedPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        const { orderId } = data;
        const order = await Order.findById(orderId).populate("Ticket").exec();

        if (!order) {
            throw new NotFoundError();
        }

        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.status = OrderStatus.Cancelled;

        await order.save();


        await new OrderCreatedPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })

        msg.ack();
    }

}