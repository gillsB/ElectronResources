import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Chart } from "./Chart";
import { useStatistics } from "./useStatistics";

function App() {
  const statistics = useStatistics(10);
  const [activeView, setActiveView] = useState<View>("CPU");
  const cpuUsages = useMemo(
    () => statistics.map((stat) => stat.cpuUsage),
    [statistics]
  );
  const ramUsages = useMemo(
    () => statistics.map((stat) => stat.ramUsage),
    [statistics]
  );
  const storageUsages = useMemo(
    () => statistics.map((stat) => stat.storageUsage),
    [statistics]
  );

  const activeUsages = useMemo(() => {
    switch (activeView) {
      case "CPU":
        console.log("cpu");
        return cpuUsages;
      case "RAM":
        console.log("ram");
        return ramUsages;
      case "STORAGE":
        console.log("storage");
        return storageUsages;
    }
  }, [activeView, cpuUsages, ramUsages, storageUsages]);

  useEffect(() => {
    return window.electron.subscribeChangeView((view) => setActiveView(view));
  }, []);

  return (
    <>
      <div className="App">
        <Header />
        <div>
          <div className="mainGrid">
            <Chart data={activeUsages} maxDataPoints={10}></Chart>
          </div>
        </div>
      </div>
    </>
  );
}

function Header() {
  return (
    <header>
      <button
        id="minimize"
        onClick={() => window.electron.sendFrameAction("MINIMIZE")}
      >
        ─
      </button>
      <button
        id="maximize"
        onClick={() => window.electron.sendFrameAction("MAXIMIZE")}
      >
        <span className="maximize-icon"></span>
      </button>
      <button
        id="close"
        onClick={() => window.electron.sendFrameAction("CLOSE")}
      >
        ✕
      </button>
    </header>
  );
}

export default App;
