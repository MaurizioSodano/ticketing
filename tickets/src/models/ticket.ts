import mongoose from "mongoose";


// interface for constructor parameters
interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

// An interface that describes the properties that a User Document has
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;

}
//an interface that describes the properties that a User Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
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
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    optimisticConcurrency: true,
    versionKey: "version",
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
    return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);


export { Ticket };

