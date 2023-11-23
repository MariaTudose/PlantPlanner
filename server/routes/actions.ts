import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import Action, { IAction } from '../models/action';

const router = express.Router();

router.get('/:plantId', (req: Request, res: Response, next: NextFunction) => {
    Action.find({ plantId: req.params.plantId })
        .then(actions => res.json(actions))
        .catch(error => next(error));
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    req.body.forEach((action: IAction) => {
        action._id = crypto.randomUUID();
    });

    Action.insertMany(req.body)
        .then(actions => {
            res.json(actions);
        })
        .catch(error => next(error));
});

export default router;
