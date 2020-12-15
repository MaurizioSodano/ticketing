export enum OrderStatus {
    //order created but not yet reserved
    Created = "created",
    // The ticket has been already reserved, 
    // or the order has been deleted
    // or the order has been expired
    Cancelled = "cancelled",
    // The order has been successfully reserved
    AwaitingPayment = "awaiting:payment",
    // The payment has been successful
    Complete = "complete"
}