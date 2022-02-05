export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const getFirstWeekDay = date => (new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) % 7;
export const getDaysInMonth = date => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
