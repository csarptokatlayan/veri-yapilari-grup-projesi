import { useState } from 'react';
import './App.css';
import Topbar from './Topbar';
import LeftPanel from './LeftPanel';
import CenterCanvas from './CenterCanvas';
import RightInspector from './RightInspector';

/**
 * Butun siniflarin calistirildigi ana dosya.
 * F3-US4: Sol panelden gelen algoritma sonuclarini orta kanvasa tasiyan state yonetimi kuruldu.
 * @author Semih Tuncel
 * @author Murat Kutku (AlgorithmResult Ebeveyn State Altyapisi ve Bileşenler Arası Veri Köprüsü)
 */
export default function App() {
 
  const [algoResult, setAlgoResult] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div className="app-shell">
      <Topbar />
      
      {/* Sol panel, algoritma sonucunu App'e bildirir */}
      <LeftPanel onAlgorithmResult={setAlgoResult} />
      
      {/* Orta kanvas hem algoritma sonucunu alır, hem de tıklanan node'u App'e bildirir */}
      <CenterCanvas 
        algorithmResult={algoResult} 
        onNodeSelect={setSelectedNode} 
      />
      
      {/* Sağ panel, App'teki seçili node bilgisini alır ve ekrana basar */}
      <RightInspector selectedNode={selectedNode} />
    </div>
  );
}
