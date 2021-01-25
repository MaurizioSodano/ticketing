import { Subjects, Listener, ExpirationCompleteEvent, NotFoundError, OrderStatus } from "@mauriziosodano/ticketing-common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    queueGroupName = queueGroupName;
    readonly subject = Subjects.ExpirationComplete;


    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        const { orderId } = data;
        const order = await Order.findById(orderId).populate("ticket").exec();

        if (!order) {
            throw new NotFoundError();
        }

        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.set({ status: OrderStatus.Cancelled });

        await order.save();


        const orderCancelledData = {
            id: (order.id as string),
            version: order.version,
            ticket: {
                id: (order.ticket.id as string),
            }
        };

        await new OrderCancelledPublisher(this.client).publish(orderCancelledData)

        msg.ack();
    }

}