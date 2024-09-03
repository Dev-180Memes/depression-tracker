import { useState, useEffect } from "react";
import axios from "axios";
import { decodeJWT } from "@/lib/decodeToken";

const MoodInputForm = ({ setMoodData, moodData, setAlerts }: { setMoodData: any, moodData: any, setAlerts: any }) => {
    const [sleptWell, setSleptWell] = useState<boolean | null>(null);
    const [highEnergy, setHighEnergy] = useState<boolean | null>(null);
    const [feelingStressed, setFeelingStressed] = useState<boolean | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const threshold = 5;
    const sudden_change = 3;
    const consistent_low_count = 3;

    const calculateMoodScore = () => {
        // Algorithm to calculate mood score based on yes/no answers
        let score = 0;
        if (sleptWell) score += 2;  // Positive impact on mood
        if (highEnergy) score += 2; // Positive impact on mood
        if (feelingStressed) score -= 2; // Negative impact on mood

        // Normalize score to a 1-10 scale (optional)
        score = Math.max(1, Math.min(10, 5 + score));
        return score;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const moodScore = calculateMoodScore();
        const token = localStorage.getItem("token");

        if (!token) {
            setErrorMessage("No token found. Please log in again.");
            return;
        }

        const decodedToken = decodeJWT(token);

        if (!decodedToken) {
            setErrorMessage("Invalid token. Please log in again.");
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const response = await axios.post('/api/mood', { mood_score: moodScore }, config);
            console.log("Response:", response);
            if (response.data.data.errors) {
                setErrorMessage(response.data.data.errors.json.mood_score);
                return;
            }

            const alerts = [];
            const new_entry = response.data.data;
            const previous_entry = moodData[moodData.length - 1];

            // Check for sudden mood change;
            if (new_entry.mood_score < threshold && previous_entry.mood_score >= threshold && previous_entry.mood_score - new_entry.mood_score >= sudden_change) {
                alerts.push({
                    message: `Sudden mood change detected: ${previous_entry.mood_score} -> ${new_entry.mood_score}`,
                    timestamp: new_entry.createdAt,
                });
            }

            setMoodData((prevData: any) => [...prevData, response.data.data]);

            // Check for consistent low mood;
            if (new_entry.mood_score < threshold) {
                const recent_entries = moodData.slice(-consistent_low_count);
                if (recent_entries.length === consistent_low_count && recent_entries.every((entry: any) => entry.mood_score < threshold)) {
                    alerts.push({
                        message: `Consistent low mood detected for ${consistent_low_count} entries`,
                        timestamp: new_entry.createdAt,
                    });
                }
            }

            for (const alert of alerts) {
                try {
                    await axios.post('/api/alerts', { message: alert.message }, config);
                    setAlerts((prevAlerts: any) => [...prevAlerts, alert]);
                } catch (error) {
                    console.error("Error submitting alert:", error);
                    setErrorMessage("Error submitting alert. Please try again.");
                }
            }

            setSuccessMessage("Mood score submitted successfully!");
            setErrorMessage("");
            setSleptWell(null);
            setHighEnergy(null);
            setFeelingStressed(null);
        } catch (error) {
            console.error("Error submitting mood score:", error);
            setErrorMessage("Error submitting mood score. Please try again.");
        }
    };

    return (
        <form 
            onSubmit={handleSubmit}
            className="flex gap-4 flex-col justify-center items-center"
        >
            <div className="flex flex-col gap-2 text-lg text-white">
                <label>
                    Did you sleep well last night?
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setSleptWell(true)} className={`px-4 py-2 rounded-lg ${sleptWell === true ? 'bg-green-500' : 'bg-gray-600'} text-white`}>
                            Yes
                        </button>
                        <button type="button" onClick={() => setSleptWell(false)} className={`px-4 py-2 rounded-lg ${sleptWell === false ? 'bg-red-500' : 'bg-gray-600'} text-white`}>
                            No
                        </button>
                    </div>
                </label>

                <label>
                    Do you have high energy today?
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setHighEnergy(true)} className={`px-4 py-2 rounded-lg ${highEnergy === true ? 'bg-green-500' : 'bg-gray-600'} text-white`}>
                            Yes
                        </button>
                        <button type="button" onClick={() => setHighEnergy(false)} className={`px-4 py-2 rounded-lg ${highEnergy === false ? 'bg-red-500' : 'bg-gray-600'} text-white`}>
                            No
                        </button>
                    </div>
                </label>

                <label>
                    Are you feeling stressed?
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setFeelingStressed(true)} className={`px-4 py-2 rounded-lg ${feelingStressed === true ? 'bg-red-500' : 'bg-gray-600'} text-white`}>
                            Yes
                        </button>
                        <button type="button" onClick={() => setFeelingStressed(false)} className={`px-4 py-2 rounded-lg ${feelingStressed === false ? 'bg-green-500' : 'bg-gray-600'} text-white`}>
                            No
                        </button>
                    </div>
                </label>
            </div>

            <button type="submit" className="text-sm bg-blue-600 px-5 py-2 rounded-lg text-white">Submit</button>
            {successMessage && <p className="bg-neutral-900 text-green-500">{successMessage}</p>}
            {errorMessage && <p className="bg-neutral-900 text-red-500">{errorMessage}</p>}
        </form>
    );
};

export default MoodInputForm;

