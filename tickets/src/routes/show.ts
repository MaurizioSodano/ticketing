import express, { Request, Response } from "express";
import { NotFoundError } from "@mauriziosodano/ticketing-common";
import { Ticket } from "../models/ticket";



const router = express.Router();


router.get("/api/tickets/:id", async (req: Request, res: Response) => {
    console.log("requesting ticket", req.params.id)
    const ticket = await Ticket.findById(req.params.id).exec();
    if (!ticket) {
        throw new NotFoundError();
    }

    res.send(ticket);

})

export { router as showTicketRouter };