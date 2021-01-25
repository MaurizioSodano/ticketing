import { Publisher, Subjects, ExpirationCompleteEvent } from "@mauriziosodano/ticketing-common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;

}