import { Publisher, Subjects ,OrderCreatedEvent } from "@mauriziosodano/ticketing-common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;

}