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
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div className="app-shell">
      <Topbar />
      <LeftPanel />
      <CenterCanvas onNodeSelect={setSelectedNode} />
      <RightInspector selectedNode={selectedNode} />
    </div>
  );
}
