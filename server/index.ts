import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Plant, { IPlant } from './models/plant';
import Action from './models/action';
import middleware from './utils/middleware';

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const url = process.env.MONGODB_URI as string;

mongoose.connect(url);

app.use(cors());
app.use(middleware.requestLogger);

app.use(express.static('public'));
app.use(express.json());

app.get('/api/plants', (req: Request, res: Response) => {
    Plant.find({ isDeleted: false }).then(plants => {
        res.json(plants);
    });
});

app.put('/api/plants/:id', (req: Request, res: Response, next: NextFunction) => {
    Plant.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(updatedPlant => {
            res.json(updatedPlant);
        })
        .catch(error => next(error));
});

app.put('/api/plants', (req: Request, res: Response, next: NextFunction) => {
    const bulkOps = req.body.map((plant: IPlant & { id: string }) => ({
        updateOne: {
            filter: {
                _id: plant.id,
            },
            update: { ...plant },
        },
    }));

    Plant.bulkWrite(bulkOps)
        .then(opResult => {
            if (opResult.ok) {
                Plant.find({ isDeleted: false }).then(plants => {
                    res.json(plants);
                });
            }
        })
        .catch(error => next(error));
});

app.get('/api/actions/:plantId', (req: Request, res: Response, next: NextFunction) => {
    Action.find({ plantId: req.params.plantId })
        .then(actions => res.json(actions))
        .catch(error => next(error));
});

app.post('/api/actions', (req: Request, res: Response, next: NextFunction) => {
    // TODO: update plant dates
    req.body.forEach((action: IAction) => {
        action._id = crypto.randomUUID();
    });

    Action.insertMany(req.body)
        .then(actions => {
            res.json(actions);
        })
        .catch(error => next(error));
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
