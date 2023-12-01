import { format } from 'date-fns';
import { deleteAction } from '../../../services/actions';
import Drop from '../../../static/drop.svg?react';
import Fertilizer from '../../../static/fertilizer.svg?react';
import Close from '../../../static/close.svg?react';

import './style.scss';

interface ActivityTabPanelProps {
    active: boolean;
    pastActions: Action[];
    setPastActions: (actions: Action[]) => void;
}

const ActivityTabPanel = ({ active, pastActions, setPastActions }: ActivityTabPanelProps) => {
    const onDelete = (action: Action) => {
        if (window.confirm('Are you sure you want to delete the action?')) {
            deleteAction(action.id).then(() =>
                setPastActions(pastActions.filter(watering => watering.id !== action.id))
            );
        }
    };

    return (
        <div className={`activity-panel ${active ? 'active' : ''}`}>
            <ul className="action-list">
                {pastActions.map(action => (
                    <li className="action-item" key={action.id}>
                        <span className="action-icon">{action.action === 'water' ? <Drop /> : <Fertilizer />}</span>
                        <span className="action-name">{action.action} </span>
                        <span className="action-date">{format(action.date, 'd MMM yy')}</span>
                        <button className="delete-button" onClick={() => onDelete(action)} type="button">
                            <Close />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivityTabPanel;
