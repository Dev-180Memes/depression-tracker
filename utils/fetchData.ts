const moodTrackerAPI = process.env.MOODTRACKER_API_BASE_URL;

export async function fetchAPI (url: string, method: string = 'GET', headers: HeadersInit = {}, body: any = null) {
    // console.log(body)
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: body ? JSON.stringify(body) : null
    });
    return await response.json();
}

export const checkServer = async () => fetchAPI(`${moodTrackerAPI}/health`);

export const getActiveUser = async () => fetchAPI(`${moodTrackerAPI}/getuser`);

export const loginUser = async (username: string, email: string, password: string,) => {
    return fetchAPI(`${moodTrackerAPI}/login`, 'POST', {}, {
        username: username,
        email: email,
        password: password
    });
};

export const logoutUser = async () => fetchAPI(`${moodTrackerAPI}/logout`);

export const postMood = (moodScore: number) => {
    return fetchAPI(`${moodTrackerAPI}/mood`, 'POST', {}, {
        'mood_score': moodScore
    })
}

export const getMoods = async () => fetchAPI(`${moodTrackerAPI}/mood`);