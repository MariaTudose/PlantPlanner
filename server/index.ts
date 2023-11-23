import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import middleware from './utils/middleware';
import plantRouter from './routes/plants';
import actionRouter from './routes/actions';

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const url = process.env.MONGODB_URI as string;

mongoose.connect(url);

app.use(cors());
app.use(middleware.requestLogger);

app.use(express.static('public'));
app.use(express.json());

app.use('/api/plants', plantRouter);
app.use('/api/actions', actionRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
