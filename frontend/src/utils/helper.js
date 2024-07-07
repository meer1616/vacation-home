const isLoggedin = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return userData ? true : false;
}

const getStringFromEpoch = (epoch) => {
    const date = new Date(epoch*1000);
    return getStringFromDateObject(date);
}

const getStringFromDateObject = (date) => {
    const day = date.toLocaleDateString('en-US', { day: 'numeric' });
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.toLocaleDateString('en-US', { year: 'numeric' });

    return `${day} ${month}, ${year}`;
}

export { isLoggedin, getStringFromDateObject, getStringFromEpoch}