import express, {Request, Response} from 'express';
import {body, validationResult} from 'express-validator';
import { RequestValidationError } from '../errors/request-validation';
import { Password } from '../services/password';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';

const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/api/users/signin', 
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('you must supply password')
    ],
    validateRequest,
    async (req: Request, res: Response)=>{

        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequestError('non existing user');
        }
        const passwordMatch = await Password.compare(existingUser.password, password);

        if( !passwordMatch) {
            throw new BadRequestError('invalid psswd')
        }

        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_KEY! );
    
        req.session = {
            jwt: userJwt
        };
            
    
        res.status(200).send(existingUser);


});


export { router as signinRouter};