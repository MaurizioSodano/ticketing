import express, { Request, Response } from "express";
import { Order, OrderStatus } from "../models/order"
import { NotAuthorizedError, NotFoundError, requireAuth } from "@msticketingudemy/common";
import { OrderCreatedPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper"

const router = express.Router();

router.delete(`/api/orders/:orderId`, requireAuth,
    async (req: Request, res: Response) => {
        const { orderId } = req.params;

        const order = await Order.findById(orderId).populate("ticket").exec();

        if (!order) {
            throw new NotFoundError();
        }
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        order.status = OrderStatus.Cancelled;
        await order.save();

        // publish cancellation event

        await new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            ticket: {
                id: order.ticket.id
            }
        })
        res.status(204).send(order);


    })

export { router as deleteOrderRouter };