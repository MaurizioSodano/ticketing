import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@msticketingudemy/common";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper"


const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post("/api/orders", requireAuth, [
    body("ticketId")
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) //coupling validation of orders with another Service DB implementation !!!
        .withMessage("ticketId is required"),
], validateRequest,
    async (req: Request, res: Response) => {
        // Find the ticket the user is trying to order in the database

        const { ticketId } = req.body;

        const ticket = await Ticket.findById(ticketId).exec();

        if (!ticket) {
            throw new NotFoundError();
        }

        // make sure the ticket is not already reserved by someone else


        const isReserved = await ticket.isReserved();
        if (isReserved) {
            throw new BadRequestError("Ticket is already reserved");
        }
        // calculate the expiration date for the order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);


        // Build the order and save to the database
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });

        await order.save();


        // Publish an event sayng that the order has created
        await new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            userId: order.userId,
            status: order.status,
            expiresAt: order.expiresAt.toISOString(),
            version: order.version,
            ticket: {
                id: ticket.id,
                price: ticket.price,

            }
        })

        res.status(201).send(order);
    }
);

export { router as createOrderRouter };