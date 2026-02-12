// App.jsx
import './App.css';
import MorphScene from './MorphScene';
import { useState } from 'react';

export default function App() {
  const [start, setStart] = useState(false);

  return (
    <div className="scroll-container">

      {!start && (
        <div className="hero">
          <div className="overlay" />
          <div className="content">
            <h1>Ishini & Buwaneka</h1>
            <p>04 June 2026</p>
            <button className="cta" onClick={() => setStart(true)}>
              Click Here
            </button>
          </div>
        </div>
      )}

      {start && <MorphScene />}

    </div>
  );
}