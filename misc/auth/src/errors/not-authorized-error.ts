import { CustomError } from "./custom-error";


export class NotAuthorizedError extends CustomError {
    statusCode = 401;

    constructor() {
        super('not A');
        Object.setPrototypeOf(this, NotAuthorizedError.prototype)
    }

    serializeErrors() {
        return [{ message: 'not authorized'}];
    }
        
}