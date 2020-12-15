import { Publisher, Subjects, TicketUpdatedEvent } from "@msticketingudemy/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;

}