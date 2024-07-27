// components/MoodChart.tsx
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData, 
  ChartOptions, 
  plugins
} from "chart.js";
import React, { useEffect, useState } from "react";
import faker from "faker";

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Mood Chart',
    },
  },
};

const MoodChart = ({ data }: { data: any}) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Data',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  })

  useEffect(() => {
    setChartData({
      labels: data.map((entry: any) => entry.timestamp),
      datasets: [
        {
          ...chartData.datasets[0],
          data: data.map((entry: any) => entry.mood_score),
        }
      ]
    })
  }, [data]);

  return <Line data={chartData} options={options} />;
};

export default MoodChart;
