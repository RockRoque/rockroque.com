import { useState } from 'react';
import SplashGate from './SplashGate';
import ExperienceLanding from './ExperienceLanding';

export default function LandingIsland() {
  const [entered, setEntered] = useState(false);

  return (
    <>
      {!entered && <SplashGate onComplete={() => setEntered(true)} />}
      {entered && <ExperienceLanding />}
    </>
  );
}
