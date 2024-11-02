import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const PlotChart = ({ array }) => {
  const data = {
    labels: array.map((_, index) => index + 1),
    datasets: [
      {
        label: "Graph Plot",
        data: array,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Line Chart Example",
      },
    },
  };

  return (
    <div
      className="relative rounded-3xl"
      style={{ backgroundColor: "black", width: "100%", height: "100%" }}
    >
      <div style={{ width: "100%", height: "100%" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default PlotChart;
