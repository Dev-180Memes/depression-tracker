// pages/dashboard.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import withAuth from "@/utils/withAuth";
import MoodInputForm from '@/components/MoodInputForm';
import MoodChart from '@/components/MoodChart';
import AlertNotifications from '@/components/AlertNotification';
import Link from 'next/link';
import { decodeJWT } from '@/lib/decodeToken';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [moodData, setMoodData] = useState([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  // const [stats, setStats] = useState({
  //   best_streak: 0,
  //   current_streak: 0,
  //   percentile: 0,
  // });
  const [decodedToken, setDecodedToken] = useState<any | null>(null);

  useEffect(() => {
    const token: string | null = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    const decodedToken = decodeJWT(token);
    if (!decodedToken) {
      router.push('/');
      return;
    }
    setDecodedToken(decodedToken);
  }, [router]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      try {
        const userResponse = await axios.get('/api/user', config);
        // console.log("User response:", userResponse.data.data);
        setUser(userResponse.data.data);

        const moodResponse = await axios.get('/api/mood', config);
        // console.log("Mood response:", moodResponse.data.data);
        setMoodData(moodResponse.data.data.mood_entries);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Fetch alerts
    const fetchAlerts = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      try {
        const response = await axios.get('/api/alerts/fetchAlerts', config);
        // console.log("Alerts response:", response.data.data);
        setAlerts(response.data.data.alerts)
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    }

    fetchAlerts();
  }, []);


  // console.log(moodData);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <MoodInputForm 
        setMoodData={setMoodData}
        moodData={moodData}
        setAlerts={setAlerts}
      />
      <MoodChart data={moodData} />
      {/* show last 10 mood entries history*/}
      <div>
        <h2>Recent Mood Entries</h2>
        <table>
          <thead>
            <tr>
              <th>Mood Score</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {/* Show latest entry first */}
            {moodData.slice(0, 10).map((mood: any) => (
              <tr key={mood.id}>
                <td>{mood.mood_score}</td>
                <td>{mood.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <ul>
          {moodData.slice(0, 10).map((mood: any) => (
            <li key={mood.id}>
              {mood.mood_score} - {mood.timestamp}
            </li>
          ))}
        </ul> */}
      </div>
      <AlertNotifications 
        alerts={alerts}
      />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default withAuth(Dashboard);
