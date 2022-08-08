import express from 'express';
import cookieSession from 'cookie-session';

import { json } from 'body-parser';
import 'express-async-errors'
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from "./errors/not-found-error";

import mongoose from 'mongoose';


const app = express();
app.set('trust proxy', true);


app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: true
    })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res, next) =>{
    throw new NotFoundError() ;
})
app.use(errorHandler);


export { app };