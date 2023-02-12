export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const getFirstWeekday = date => (new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) % 7;
export const getLastWeekday = date => (new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay() + 6) % 7;
export const getDaysInMonth = date => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

export const getPlantsToday = (plants, selectedDate) =>
    plants.filter(plant => new Date(plant.nextWateringDate).toDateString() === selectedDate.toDateString());

export const getIntervals = plants =>
    plants
        .map(plants => plants.interval)
        .reduce((res, interval) => {
            res[interval] = (res[interval] || 0) + 1;
            return res;
        }, {});