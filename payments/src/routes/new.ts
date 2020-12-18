import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@msticketingudemy/common";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { stripe } from "../stripe"
import { natsWrapper } from "../nats-wrapper";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher"

const router = express.Router();

router.post("/api/payments", requireAuth, [
    body("token")
        .not()
        .isEmpty()
        .withMessage("Token is required"),
    body("orderId")
        .not()
        .isEmpty()
        .withMessage("orderId is required"),
], validateRequest,
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;
        const order = await Order.findById(orderId).exec();

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError("Cannot pay for a cancelled order");
        }

        const charge = await stripe.charges.create({
            currency: "eur",
            amount: order.price * 100,
            source: token

        });

        if (!charge) {
            throw new Error("Payment unsuccessful");
        }
        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        })
        await payment.save();

        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: (payment.id as string),
            orderId: payment.orderId,
            stripeId: payment.stripeId,
        });
        res.status(201).send({ id: payment.id });
    }
);

export { router as createChargeRouter };