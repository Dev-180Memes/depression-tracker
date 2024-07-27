/* eslint-disable @next/next/no-img-element */
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

  // useEffect(() => {
  //   const token: string | null = localStorage.getItem('token');
  //   if (!token) {
  //     router.push('/');
  //     return;
  //   }
  //   const decodedToken = decodeJWT(token);
  //   if (!decodedToken) {
  //     router.push('/');
  //     return;
  //   }
  //   setDecodedToken(decodedToken);
  // }, [router]);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const token = localStorage.getItem('token');
  //     const config = {
  //       headers: { Authorization: `Bearer ${token}` },
  //     };

  //     try {
  //       const userResponse = await axios.get('/api/user', config);
  //       // console.log("User response:", userResponse.data.data);
  //       setUser(userResponse.data.data);

  //       const moodResponse = await axios.get('/api/mood', config);
  //       // console.log("Mood response:", moodResponse.data.data);
  //       setMoodData(moodResponse.data.data.mood_entries);
  //     } catch (error) {
  //       console.error('Failed to fetch user data', error);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  // useEffect(() => {
  //   // Fetch alerts
  //   const fetchAlerts = async () => {
  //     const token = localStorage.getItem('token');
  //     const config = {
  //       headers: { Authorization: `Bearer ${token}` },
  //     };

  //     try {
  //       const response = await axios.get('/api/alerts/fetchAlerts', config);
  //       // console.log("Alerts response:", response.data.data);
  //       setAlerts(response.data.data.alerts)
  //     } catch (error) {
  //       console.error('Error fetching alerts:', error);
  //     }
  //   }

  //   fetchAlerts();
  // }, []);


  // console.log(moodData);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <>
  <header className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[48] w-full border-b text-sm py-2.5 sm:py-4 lg:ps-64 bg-gray-900 border-gray-800">
    <nav className="flex basis-full items-center w-full mx-auto px-4 sm:px-6">
      <div className="me-5 lg:me-0 lg:hidden">
        <Link href="/" className="flex rounded-xl text-xl gap-1 font-semibold text-green-500 focus:outline-none focus:opacity-80">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-auto">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
          </svg>
        </Link>
      </div>

      <div className="w-full flex items-center justify-end ms-auto sm:justify-between sm:gap-x-3 sm:order-3">
        <div className="sm:hidden">
          <button type="button" className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-green-500 hover:bg-gray-800">
            <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
        </div>
      </div>

      <div className="hidden sm:block">
        <label htmlFor="icon" className="sr-only">Search</label>
        <div className="relative min-w-72 md:min-w-80">
          <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
            <svg className="flex-shrink-0 size-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <input type="text" id="icon" name="icon" className="py-2 px-4 ps-11 block w-full rounded-lg text-sm bg-gray-800 border-gray-700 text-green-500 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500" placeholder="Search" />
        </div>
      </div>

      <div className="flex flex-row items-center justify-end gap-2">
        <button type="submit" className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-green-500 hover:bg-gray-800">
          <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </button>
        <button type="button" className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-green-500 hover:bg-gray-800" data-hs-offcanvas="#hs-offcanvas-right">
          <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </button>

        <div className="hs-dropdown [--placement:bottom-right] relative inline-flex">
          <button id="hs-dropdown-with-header" type="button" className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-green-500 hover:bg-gray-800">
            <img 
              className="inline-block h-10 w-10 rounded-full ring-2 ring-gray-800"
              src="https://source.unsplash.com/random"
              alt="Image of user profile" 
            />
          </button>

          <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 shadow-md rounded-lg p-2 bg-gray-900 border-gray-700">
            <div className="py-3 px-5 -m-2 rounded-t-lg bg-gray-800">
              <p className="text-sm text-gray-400">Signed in as</p>
              <p className="text-sm font-medium text-gray-300">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <div className="sticky top-0 inset-x-0 z-20 border-y px-4 sm:px-6 md:px-8 lg:hidden bg-gray-900 border-gray-800">
    <div className="flex justify-between items-center py-2">
      <ol className="ms-3 flex items-center whitespace-nowrap text-green-500">
        <li className="flex items-center text-sm">
          Home
          <svg className="flex-shrink-0 mx-3 overflow-visible size-2.5" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </li>
        <li className="text-sm font-semibol truncate" aria-current="page">
          Dashboard
        </li>
      </ol>
      <button type="button" className="py-2 px-3 flex justify-center items-center gap-x-1.5 text-xs rounded-lg border border-gray-700 text-green-500 hover:text-gray-200" data-hs-overlay="#application-sidebar" aria-controls="application-sidebar" aria-label="Sidebar">
        <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8L21 12L17 16M3 12H13M3 6H13M3 18H13"/></svg>
        <span className="sr-only">Sidebar</span>
      </button>
    </div>
  </div>

  <div id="application-sidebar" className="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform w-[260px] hidden fixed inset-y-0 start-0 z-[60] lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 border-e bg-gray-900 border-gray-800">
    <div className="px-8 pt-4">
      <Link href="/" className="flex rounded-md text-xl gap-1 font-semibold text-green-500 focus:outline-none focus:opacity-80">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-auto">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
        </svg>
        <p className="font-medium">MoodTracker</p>
      </Link>
    </div>

    <div className="hs-accordion-group p-6 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
      <ul className="space-y-1.5">
        <li>
          <Link href="/" className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg bg-gray-800 text-green-500 hover:bg-gray-700">
            <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </Link>
        </li>

        <li>
          <Link href="https://github.com/drycode/MoodTracker-API" className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg bg-gray-800 text-green-500 hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
            </svg>
            Open Source
          </Link>
        </li>
      </ul>
    </div>
  </div>

  <div className="w-full lg:ps-64">
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="flex flex-col border shadow-sm rounded-xl bg-gray-800 border-gray-700">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-2">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Welcome Back
              </p>
            </div>
            <div className="mt-1 flex items-center gap-x-2">
              <h3 className="text-xl sm:text-2xl font-medium text-green-500">
                Hello {user?.username}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="flex flex-col border shadow-sm rounded-xl bg-gray-800 border-green-700">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-2">
              <p className="text-xs uppercase tracking-wide text-green-300">
                How are you feeling
              </p>
              <div className="hs-tooltip">
                <div className="hs-tooltip-toggle">
                  <svg className="flex-shrink-0 size-4 text-green-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                  <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 text-xs font-medium text-green-500 rounded shadow-sm bg-green-700" role="tooltip">
                    Score ranges from 1 to 10, with 1 being the saddest and 10 being the happiest
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-1 flex items-center gap-x-2">
              <h3 className="text-xl sm:text-2xl font-medium">
                <MoodInputForm 
                  setMoodData={setMoodData}
                  moodData={moodData}
                  setAlerts={setAlerts}
                />
              </h3>
            </div>
          </div>
        </div>
      </div>

      <MoodChart data={moodData} />

      <div className="mt-2">
        <h2 className="text-2xl font-bold text-green-500">Recent Mood Entries</h2>
        <table className="table-fixed border border-collapse border-slate-500 p-1 w-full">
          <thead>
            <tr>
              <th className="border border-slate-700 p-2 text-green-500">Mood Score</th>
              <th className="border border-slate-700 p-2 text-green-500">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {moodData.slice(0, 10).map((mood: any) => (
              <tr key={mood.id}>
                <td className="border border-slate-700 p-2 text-green-500">{mood.mood_score}</td>
                <td className="border border-slate-700 p-2 text-green-500">{mood.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AlertNotifications alerts={alerts} />
      <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Logout</button>
    </div>
  </div>
</>

  );
};

export default withAuth(Dashboard);
