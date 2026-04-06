import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Widget } from "./components/Widget";

function App() {
  const widgetRef = useRef(null);
  const projectId = null; // or from state/props

  useEffect(() => {
    if (widgetRef.current) {
      widgetRef.current.setAttribute("project-id", projectId);
    }
  }, [projectId]);

  return (
    <div>
      <Widget ref={widgetRef} />{" "}
    </div>
  );
}

export default App;
