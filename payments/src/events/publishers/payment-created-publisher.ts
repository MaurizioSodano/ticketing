import { Publisher, Subjects, PaymentCreatedEvent } from "@mauriziosodano/ticketing-common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;

}