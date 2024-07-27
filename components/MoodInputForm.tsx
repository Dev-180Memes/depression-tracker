import { useState, useEffect } from "react";
import axios from "axios";
import { decodeJWT } from "@/lib/decodeToken";

const MoodInputForm = ({ setMoodData, moodData, setAlerts }: { setMoodData: any, moodData: any, setAlerts: any }) => {
    const [moodScore, setMoodScore] = useState(0);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const threshold = 5;
    const sudden_change = 3;
    const consistent_low_count = 3;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
            // console.log("Response:", response.data.data);
            if (response.data.data.errors) {
                setErrorMessage(response.data.data.errors.json.mood_score);
                return;
            }

            const alerts = [];
            const new_entry = response.data.data;
            const previous_entry = moodData[moodData.length - 1];

            //  Check for sudden mood change;
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
            setMoodScore(0);
        } catch (error) {
            console.error("Error submitting mood score:", error);
            setErrorMessage("Error submitting mood score. Please try again.");
        }
    };

    return (
        <form 
            onSubmit={handleSubmit}
            className="flex gap-2 flex-col justify-center items-center"
        >
            <label
                className="flex flex-col gap-1 justify-center text-lg text-white"
            >
                Mood Score:
                <input
                    type="number"
                    value={moodScore}
                    onChange={(e) => setMoodScore(parseInt(e.target.value))}
                    className="border rounded px-2 text-black"
                />
            </label>
            <button type="submit" className="text-sm bg-blue-600 px-5 py-2 rounded-lg text-white">Submit</button>
            {successMessage && <p className="bg-neutral-900 text-green-500">{successMessage}</p>}
            {errorMessage && <p className="bg-neutral-900 text-red-500">{errorMessage}</p>}
        </form>
    );
};

export default MoodInputForm;