import { useEffect, useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { useStatistics } from './useStatistics'
import { Chart } from './Chart'

function App() {
  const [count, setCount] = useState(0)
  const statistics = useStatistics(10);
  const [activeView, setActiveView] = useState<View>("CPU");
  const cpuUsages = useMemo(()=> statistics.map(stat => stat.cpuUsage), [statistics]);
  const ramUsages = useMemo(()=> statistics.map(stat => stat.ramUsage), [statistics]);
  const storageUsages = useMemo(()=> statistics.map(stat => stat.storageUsage), [statistics]);

  const activeUsages = useMemo(()=> {
    switch(activeView) {
      case "CPU":
        console.log("cpu")
        return cpuUsages;
      case "RAM":
        console.log("ram")
        return ramUsages;
      case "STORAGE":
        console.log("storage")
        return storageUsages;
    }
  }, [activeView, cpuUsages, ramUsages, storageUsages]);

  useEffect(()=>{
    return window.electron.subscribeChangeView((view)=> setActiveView(view));
  }, []);


  return (
    <>
      <div className="App">
        <header>
        <button id="minimize">─</button>
        <button id="maximize"><span className="maximize-icon"></span></button>
        <button id="close">✕</button>
        </header>
        <div style={{height: 120}}>
          <Chart data = {activeUsages} maxDataPoints={10}></Chart>
        </div>
        <div>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  )
}

export default App
