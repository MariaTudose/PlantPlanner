import express, { Request, Response, NextFunction } from 'express';
import Plant, { IPlant } from '../models/plant';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    Plant.find({ isDeleted: false }).then(plants => {
        res.json(plants);
    });
});

router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
    Plant.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(updatedPlant => {
            res.json(updatedPlant);
        })
        .catch(error => next(error));
});

router.put('/', (req: Request, res: Response, next: NextFunction) => {
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

export default router;
