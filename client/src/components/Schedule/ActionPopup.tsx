import { add } from 'date-fns';
import { useContext } from 'react';
import { ReactComponent as Drop } from '../../static/drop.svg';
import { ReactComponent as Today } from '../../static/today.svg';
import { ReactComponent as Fertilizer } from '../../static/fertilizer.svg';
import { createActions } from '../../services/actions';
import { updatePlants } from '../../services/plants';
import { ActionType, SelectMode } from '../../enums';
import { PlantContextProps, PlantContext } from '../App';

interface ActionPopupProps {
    visible: boolean;
    selectedPlants: Array<Plant>;
    selectMode: SelectMode | null;
}

const ActionPopup = ({ visible, selectedPlants, selectMode }: ActionPopupProps) => {
    const { setPlants } = useContext(PlantContext) as PlantContextProps;

    const waterPlants = (fertilize: boolean) => {
        const currentDate = new Date();
        const plantBody = selectedPlants.map(plant => ({
            id: plant.id,
            lastWateringDate: currentDate,
            nextWateringDate: add(currentDate, { days: Number(plant.interval) }),
            lastFertilizingDate: fertilize ? currentDate : plant.lastFertilizingDate,
        }));

        const actionBody = selectedPlants.map(plant => ({
            plantId: plant.id,
            action: ActionType.WATER,
            date: currentDate,
        }));

        if (fertilize) {
            const fetrilizeActions = selectedPlants.map(plant => ({
                plantId: plant.id,
                action: ActionType.FERTILIZE,
                date: currentDate,
            }));
            actionBody.concat(fetrilizeActions);
        }

        updatePlants(plantBody).then(updatedPlants => {
            setPlants(updatedPlants);
            createActions(actionBody);
        });
    };

    const moveWatering = (i: number) => {
        const plantBody = selectedPlants.map(plant => ({
            id: plant.id,
            lastWateringDate: plant.lastWateringDate,
            nextWateringDate: i === 0 ? new Date() : add(plant.nextWateringDate, { days: i }),
        }));
        updatePlants(plantBody).then(setPlants);
    };

    return (
        <div className={`action-popup ${visible ? 'visible' : ''}`}>
            <div className="action-content">
                {selectMode === SelectMode.WATER ? (
                    <>
                        <button className="icon-button" onClick={() => waterPlants(false)}>
                            <Drop />
                        </button>
                        <button className="icon-button" onClick={() => waterPlants(true)}>
                            <Fertilizer />
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => moveWatering(-1)}>-1</button>
                        <button className="icon-button" onClick={() => moveWatering(0)}>
                            <Today />
                        </button>
                        <button onClick={() => moveWatering(1)}>+1</button>
                        <button onClick={() => moveWatering(3)}>+3</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ActionPopup;
