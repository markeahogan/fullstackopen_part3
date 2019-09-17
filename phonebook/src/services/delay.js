
const delay = (timeMS) => {
    return new Promise((resolve) => setTimeout(resolve, timeMS));
}

export default delay;