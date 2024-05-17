import { FormEvent, useContext, useEffect, useState } from 'react';
import { addDays, format } from 'date-fns';

import { ActionType } from '../../enums';
import { useDelay } from '../../hooks/useDelay';
import { useScroll } from '../../hooks/useScroll';
import { updatePlant } from '../../services/plants';
import { createActions, getActions } from '../../services/actions';

import ChevronLeft from '../../static/chevron_left.svg?react';
import ChevronRight from '../../static/chevron_right.svg?react';
import Fertilizer from '../../static/fertilizer.svg?react';
import Close from '../../static/close.svg?react';
import Drop from '../../static/drop.svg?react';
import { Plant, Action } from '../../types';

import { PlantContextProps, PlantContext } from '../App';
import PlantPic from '../PlantGrid/PlantPic';

import Tabs from './Tabs';
import InfoTabPanel from './Tabs/InfoTabPanel';
import ActivityTabPanel from './Tabs/ActivityTabPanel';
import { sortActions } from './utils';

import './style.scss';

interface PlantModalProps {
    plantIndex: number;
    setPlantIndex: (plant: number) => void;
    modalPlants: Plant[];
}

const PlantModal = ({ plantIndex, setPlantIndex, modalPlants }: PlantModalProps) => {
    const [plant, setPlant] = useState<Plant | null>(null);
    const { plants, setPlants } = useContext(PlantContext) as PlantContextProps;

    const [nextWateringDate, setNextWateringDate] = useState(new Date());
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [waterOnDate, setWaterOnDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [pastActions, setPastActions] = useState<Action[]>([]);

    const closeModal = () => {
        setModalOpen(false);
        document.body.classList.remove('has-modal');
    };

    const { scrollPlant } = useScroll(modalPlants, plantIndex, closeModal, setPlantIndex);
    useDelay(modalOpen, setPlant, setPlantIndex);

    useEffect(() => {
        setPlant(modalPlants[plantIndex - 1]);
    }, [modalPlants, plantIndex]);

    useEffect(() => {
        if (plant) {
            setNextWateringDate(plant.nextWateringDate);
            setModalOpen(true);
            getActions(plant.id).then(actions => setPastActions(sortActions(actions)));
        }
    }, [plant]);

    const updatePlants = (updatedPlant: Plant) => {
        setPlants(plants.map(plant => (plant.id === updatedPlant.id ? updatedPlant : plant)));
    };

    const updateDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        if (!newDate.getTime()) return null;
        if (e.target.name === 'next-water-date') {
            setNextWateringDate(newDate);
        } else {
            setWaterOnDate(newDate);
        }
    };

    const onWater = (e: FormEvent, fertilize = false) => {
        e.preventDefault();
        if (plant) {
            const plantBody: Partial<Plant> = {
                lastWateringDate: waterOnDate,
                nextWateringDate: addDays(waterOnDate, Number(plant.interval)),
                lastFertilizingDate: fertilize ? waterOnDate : plant.lastFertilizingDate,
            };
            const actionBody = [{ plantId: plant.id, action: ActionType.WATER, date: waterOnDate }];
            if (fertilize) {
                plantBody.lastFertilizingDate = waterOnDate;
                actionBody.push({ plantId: plant.id, action: ActionType.FERTILIZER, date: waterOnDate });
            }
            updatePlant(plant.id, plantBody).then(updatedPlant => {
                setPlant(plant);
                updatePlants(updatedPlant);
                setNextWateringDate(plantBody.nextWateringDate as Date);
                setDropdownOpen(false);
                createActions(actionBody);
            });
        }
    };

    return (
        <div id="plant-modal" className={`${modalOpen ? 'visible' : ''}`}>
            <button type="button" className="modal-backdrop" aria-label="Close modal" onClick={closeModal} />
            <div className="modal-content">
                <button className="modal-arrow modal-arrow-left" type="button" onClick={() => scrollPlant(-1)}>
                    <ChevronLeft />
                </button>
                <button className="modal-arrow modal-arrow-right" type="button" onClick={() => scrollPlant(1)}>
                    <ChevronRight />
                </button>
                <div className="plant-pic-container">
                    <PlantPic plant={plant} />
                    <button className="close-button" type="button" onClick={closeModal}>
                        <Close />
                    </button>
                    <div className="plant-pic-overlay">
                        <div>
                            <h1>{plant?.name}</h1>
                            <i>{plant?.species}</i>
                        </div>
                        <div className="water-dropdown">
                            <button
                                className="icon-button"
                                type="button"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <Drop />
                            </button>
                            <div className={`water-dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
                                <input
                                    name="water-date"
                                    type="datetime-local"
                                    value={format(waterOnDate, "yyyy-MM-dd'T'HH:mm")}
                                    onChange={updateDate}
                                />
                                <button className="menu-confirm-button" onClick={onWater}>
                                    <Drop />
                                </button>
                                <button className="menu-confirm-button" onClick={e => onWater(e, true)}>
                                    <Fertilizer />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <InfoTabPanel
                    active={activeTab === 0}
                    plant={plant}
                    closeModal={closeModal}
                    updatePlants={updatePlants}
                    nextWateringDate={nextWateringDate}
                    setNextWateringDate={setNextWateringDate}
                />
                <ActivityTabPanel active={activeTab === 1} pastActions={pastActions} setPastActions={setPastActions} />
            </div>
        </div>
    );
};

export default PlantModal;
