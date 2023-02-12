import axios from 'axios';
const baseUrl = process.env.REACT_APP_API_URL + 'api/plants';
//'http://localhost:3001/api/plants';

export const getAllPlants = () => {
    const request = axios.get(baseUrl);

    return request.then(response => response.data).catch(e => console.log('error: ', e));
};

export const updatePlant = (id, plant) => {
    const request = axios.put(`${baseUrl}/${id}`, plant);

    return request.then(response => response.data).catch(e => console.log('error: ', e));
};

export const updatePlants = plants => {
    const request = axios.put(baseUrl, plants);

    return request.then(response => response.data).catch(e => console.log('error: ', e));
};
