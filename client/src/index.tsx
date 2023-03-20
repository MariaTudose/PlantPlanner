import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import './base.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

serviceWorkerRegistration.register({
    onUpdate: registration => {
        const waitingServiceWorker = registration.waiting;

        if (waitingServiceWorker) {
            waitingServiceWorker.addEventListener('statechange', event => {
                const sw = event?.target as ServiceWorker;
                if (sw?.state === 'activated') {
                    window.location.reload();
                }
            });
            waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
        }
    },
});
