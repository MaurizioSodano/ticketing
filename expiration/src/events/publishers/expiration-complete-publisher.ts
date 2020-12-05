import { Publisher, Subjects, ExpirationCompleteEvent } from "@msticketingudemy/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;

}