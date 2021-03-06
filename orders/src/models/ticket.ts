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
    version: number;
    isReserved(): Promise<boolean>;

}
//an interface that describes the properties that a User Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>;
}


declare module "mongoose" {
    interface SchemaOptions {
        optimisticConcurrency?: boolean;
    }
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

    versionKey: "version",
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

ticketSchema.pre("save", function (next) {
    //@ts-ignore
    this.$where = {
        version: this.get("version") - 1
    };
    //@ts-ignore
    next();

})

// adding custom function 
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
};

ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    const { id, version } = event;
    return Ticket.findOne({
        _id: id,
        version: version - 1
    });
};
// run query to look all orders. Find an order where the ticket
// is the ticket we just found *and* the order status is *not* cancelled.
// If we find an order from that it means that the ticket *is* reserved
ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    }).exec();

    return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);


export { Ticket };

