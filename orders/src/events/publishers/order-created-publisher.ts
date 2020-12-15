import { Publisher, Subjects ,OrderCreatedEvent } from "@msticketingudemy/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;

}