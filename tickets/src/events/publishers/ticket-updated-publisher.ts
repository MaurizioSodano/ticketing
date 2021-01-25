import { Publisher, Subjects, TicketUpdatedEvent } from "@mauriziosodano/ticketing-common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;

}