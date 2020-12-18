import express, { Request, Response } from "express";
import { Order, OrderStatus } from "../models/order"
import { NotAuthorizedError, NotFoundError, requireAuth } from "@msticketingudemy/common";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
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
        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        // publish cancellation event

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            //@ts-ignore
            id: order.id,
            version: order.version,
            ticket: {
                //@ts-ignore
                id: order.ticket.id
            }
        })
        res.status(204).send(order);

    })

export { router as deleteOrderRouter };