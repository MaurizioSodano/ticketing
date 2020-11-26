import { Publisher, Subjects, TicketCreatedEvent } from "@msticketingudemy/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;

}