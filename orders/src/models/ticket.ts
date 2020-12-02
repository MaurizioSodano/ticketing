import mongoose from "mongoose";
import { Order, OrderStatus } from "./order"

// interface for constructor parameters
interface TicketAttrs {
    id: string;
    title: string;
    price: number;

}

// An interface that describes the properties that a User Document has
export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    isReserved(): Promise<boolean>;

}
//an interface that describes the properties that a User Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}




const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },

}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
})

// adding custom function 
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
};


// run query to look all orders. Find an order where the ticket
// is the ticket we just found *and* the order status is *not* cancelled.
// If we find an order from that it means that the ticket *is* reserved
ticketSchema.methods.isReserved = async function () {
    const exixtingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    }).exec();

    return !!exixtingOrder;
}
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);


export { Ticket };

