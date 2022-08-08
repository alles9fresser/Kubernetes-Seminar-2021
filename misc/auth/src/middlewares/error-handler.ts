import { Request, Response, NextFunction } from "express";
import {body, validationResult} from 'express-validator';
import { RequestValidationError } from '../errors/request-validation';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { CustomError } from "../errors/custom-error";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    if(err instanceof CustomError) {
        return res.status(err.statusCode).send(err.serializeErrors())
    }

    res.status(400).send({
        errors: [{message: 'something went wrong'}]
    });

};