import { Publisher, Subjects, OrderCancelledEvent } from "@msticketingudemy/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;

}