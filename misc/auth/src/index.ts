import mongoose from 'mongoose';

import {app} from './app';

const start = async () => {

    if(!process.env.JWT_KEY){
        throw new Error('jwt not defined');
    }

    try{
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
        console.log('connn to mongodb')
    }catch(err){
        console.log(err);
    }
}


app.listen(3000, () => {
    console.log('listen 300414@@@');
});


start();