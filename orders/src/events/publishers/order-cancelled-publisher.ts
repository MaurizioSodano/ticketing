import { Publisher, Subjects, OrderCancelledEvent } from "@msticketingudemy/common";

export class OrderCreatedPublisher extends Publisher<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;

}