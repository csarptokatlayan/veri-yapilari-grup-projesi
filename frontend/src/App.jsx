import { useState } from 'react';
import './App.css';
import Topbar from './Topbar';
import LeftPanel from './LeftPanel';
import CenterCanvas from './CenterCanvas';
import RightInspector from './RightInspector';


/**
 * Butun siniflarin calistirildigi ana dosya.
 * @author Semih Tuncel
 */
export default function App() {
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  return (
    <div className="app-shell">
      <Topbar />
      <LeftPanel />
      <CenterCanvas onNodeSelect={setSelectedNodeId} />
      <RightInspector selectedNodeId={selectedNodeId} />
    </div>
  );
}
