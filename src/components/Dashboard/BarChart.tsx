import { useRef, useEffect, useState } from "react";
import Chart from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar } from "@fortawesome/free-solid-svg-icons";
import { Project } from "../../api/projectsApi";

interface Props {
  project: Project;
}

export const BarChart = ({ project }: Props) => {
  const [chart, setChart] = useState<Chart>();
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const getChartData = () => {
      let results = [0, 0, 0];

      project.tasks.forEach((task) => {
        if (task.status !== "Closed") {
          if (task.type === "Issue") {
            results[0]++;
          } else if (task.type === "Feature Request") {
            results[1]++;
          } else if (task.type === "Document Change") {
            results[2]++;
          }
        }
      });

      return results;
    };

    if (null === chartRef.current) return;

    const chartData = getChartData();

    const maxCount = Math.max.apply(Math, chartData);

    if (chart != null && chart.data.datasets != null) {
      chart.data.datasets[0].data = chartData;
      chart.options!.scales!.yAxes![0]!.ticks!.max =
        maxCount === 0 ? 10 : maxCount;
      chart.update();
      setChart(chart);
      return;
    }

    const newChart = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: ["Issue", "Feature Request", "Document Change"],
        datasets: [
          {
            label: "Tasks",
            backgroundColor: ["#dc3545", "#28a745", "#007bff"],
            borderColor: "rgba(2,117,216,1)",
            data: chartData,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              time: {
                unit: "month",
              },
              gridLines: {
                display: false,
              },
              ticks: {
                maxTicksLimit: 6,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                min: 0,
                max: maxCount === 0 ? 10 : maxCount,
                maxTicksLimit: 5,
              },
              gridLines: {
                display: true,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      },
    });

    setChart(newChart);
  }, [project, chart]);

  return (
    <div className="col-xl-6">
      <div className="card mb-4">
        <div className="card-header">
          <FontAwesomeIcon className="mr-1" icon={faChartBar} />
          Task Types
        </div>
        <div className="card-body">
          <canvas
            id="myAreaChart"
            width="100%"
            height="40"
            ref={chartRef}
          ></canvas>
        </div>
      </div>
    </div>
  );
};
