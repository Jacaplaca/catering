//in miliseconds
// let timeOffset = 1000 * 60 * 60 * 12; // 12 hours
// const oneHour = 1000 * 60 * 60;
// const oneMinute = 1000 * 60;
// const oneSecond = 1000;
// const oneDay = oneHour * 24;
let timeOffset = 0;
// let timeOffset = 0 + 2 * oneDay + 3 * oneHour + 10 * oneMinute + 10 * oneSecond;

function setTimeOffset(offset: number) {
    timeOffset = offset;
}

function getCurrentTime() {
    return new Date(Date.now() + timeOffset);
}

export default getCurrentTime;
export { setTimeOffset };