import {
    checkServer,
    getActiveUser,
    loginUser,
    logoutUser,
    postMood,
    getMoods
} from './fetchData';

export const moodTracker = {
    checkServer,
    getActiveUser,
    loginUser,
    logoutUser,
    postMood,
    getMoods
};

export { loginUser, logoutUser, postMood, getMoods };