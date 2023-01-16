import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import './base.scss';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorkerRegistration.register({
    onUpdate: registration => {
        const waitingServiceWorker = registration.waiting;

        if (waitingServiceWorker) {
            waitingServiceWorker.addEventListener('statechange', event => {
                if (event.target.state === 'activated') {
                    window.location.reload();
                }
            });
            waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
        }
    },
});
