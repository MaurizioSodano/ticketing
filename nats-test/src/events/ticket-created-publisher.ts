import { Publisher,Subjects,TicketCreatedEvent } from "@mauriziosodano/ticketing-common"

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;

}