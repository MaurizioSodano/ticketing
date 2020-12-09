import { Publisher, Subjects, PaymentCreatedEvent } from "@msticketingudemy/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;

}