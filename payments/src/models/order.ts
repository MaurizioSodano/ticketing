import mongoose from "mongoose";
import { OrderStatus } from "@msticketingudemy/common"

export { OrderStatus };

// interface for constructor parameters
interface OrderAttrs {
    id: string;
    version: number;
    userId: string;
    status: OrderStatus;
    price: number;

}

// An interface that describes the properties that a User Document has
interface OrderDoc extends mongoose.Document {
    version: number;
    userId: string;
    status: OrderStatus;
    price: number;
}
//an interface that describes the properties that a User Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
    findByEvent(event: { id: string, version: number }): Promise<OrderDoc | null>;
}


declare module "mongoose" {
    interface SchemaOptions {
        optimisticConcurrency?: boolean;
    }
}

const orderSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },



}, {
    optimisticConcurrency: true,
    versionKey: "version",
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

// adding custom function 
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status,
    });
};


orderSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    const { id, version } = event;
    return Order.findOne({
        _id: id,
        version: version - 1
    });
};
const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);


export { Order };

