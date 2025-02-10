//in miliseconds
// let timeOffset = - 1000 * 60 * 60 * 20; // -20 hours
let timeOffset = 0; // -20 hours

function setTimeOffset(offset: number) {
    timeOffset = offset;
}

function getCurrentTime() {
    return new Date(Date.now() + timeOffset);
}

export default getCurrentTime;
export { setTimeOffset };