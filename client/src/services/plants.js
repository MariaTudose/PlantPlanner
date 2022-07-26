import axios from 'axios';
const baseUrl = process.env.REACT_APP_API_URL + 'api/plants';
//'http://localhost:3001/api/plants';

export const getAllPlants = () => {
    const request = axios.get(baseUrl);

    return request.then(response => response.data).catch(e => console.log('error: ', e));
};
