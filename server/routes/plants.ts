import { randomUUID } from 'crypto';
import express, { Request, Response, NextFunction } from 'express';
import Plant, { IPlant } from '../models/plant';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const {
        name,
        interval,
        location,
        lastWateringDate,
        species,
        userEnteredPlantType,
        acquisitionDate,
        needsFertilizer,
    } = req.body;
    const last = new Date(lastWateringDate);
    const nextWatering = new Date(last);
    nextWatering.setDate(nextWatering.getDate() + Number(interval));
    const now = new Date().toISOString();

    const plant = new Plant({
        _id: randomUUID(),
        name,
        interval,
        location,
        pictures: [],
        isDeleted: false,
        createdAt: now,
        updatedAt: now,
        acquisitionDate: acquisitionDate || now,
        lastWateringDate: last.toISOString(),
        nextWateringDate: nextWatering.toISOString(),
        lastFertilizingDate: null,
        userEnteredPlantType: userEnteredPlantType || '',
        species: species || '',
        needsFertilizer: needsFertilizer || false,
    });

    plant
        .save()
        .then(savedPlant => res.status(201).json(savedPlant))
        .catch(error => next(error));
});

router.get('/', (req: Request, res: Response) => {
    Plant.find({ isDeleted: false }).then(plants => {
        res.json(plants);
    });
});

router.get('/locations', async (_, res: Response, next: NextFunction) => {
    Plant.find({ isDeleted: false })
        .distinct('location')
        .then(locations => {
            res.json(locations);
        })
        .catch(error => next(error));
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
