import express from "express";
import "express-async-errors";

import { json } from "body-parser";
import { errorHandler, NotFoundError, currentUser } from "@msticketingudemy/common";

import cookieSession from "cookie-session";

import { createOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes/index";
import { deleteOrderRouter } from "./routes/delete";


const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false
}))

app.use(currentUser);
app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async (req, res, next) => {
    next(new NotFoundError());
})
app.use(errorHandler);

export { app };
