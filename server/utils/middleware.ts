import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

const requestLogger = (request: Request, response: Response, next: NextFunction) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
};

const unknownEndpoint = (_request: Request, response: Response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error: Error, _request: Request, response: Response, next: NextFunction) => {
    console.error(error.message);

    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

export default {
    requestLogger,
    unknownEndpoint,
    errorHandler,
};
