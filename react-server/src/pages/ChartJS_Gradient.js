import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ScriptableContext,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function App() {
  const data = () => {
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "First dataset",
          data: [0, -1, 0, -3, -2, -1],
          borderColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, "red");
            gradient.addColorStop(0.5, "yellow");
            gradient.addColorStop(1, "green");
            return gradient;
          },
          stepped: true,
        },
      ],
    };
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        tension: 0.35,
      },
    },
    plugins: {
      filler: {
        propagate: false,
      },
    },
    interaction: {
      intersect: true,
    },
  };

  return (
    <div>
      <Line data={data()} options={options} />
    </div>
  );
}
