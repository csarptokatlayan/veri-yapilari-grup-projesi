import { useRef, useState } from 'react';
import './App.css';
import Topbar from './Topbar';
import LeftPanel from './LeftPanel';
import CenterCanvas from './CenterCanvas';
import RightInspector from './RightInspector';

/**
 * Butun panelleri birlestirir; ortak state akislari burada ayrik tutulur.
 * F3-US4: Sol panelden gelen algoritma sonuclarini orta kanvasa tasir.
 * @author Semih Tuncel
 * @author Murat Kutku
 */
export default function App() {
  const [algoResult, setAlgoResult] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchSelection, setSearchSelection] = useState(null);
  const searchRequestIdRef = useRef(0);

  /**
   * Topbar secimini kanvasa temiz render istegi olarak yollar; requestId stale cevaplari ayirir.
   * @author Semih Tuncel
   */
  function handleSearchResultSelect(node) {
    searchRequestIdRef.current += 1;

    setSearchSelection({
      node,
      clearCanvas: true,
      requestId: searchRequestIdRef.current,
    });
  }

  return (
    <div className="app-shell">
      <Topbar onSearchResultSelect={handleSearchResultSelect} />

      <LeftPanel onAlgorithmResult={setAlgoResult} />

      <CenterCanvas
        algorithmResult={algoResult}
        searchSelection={searchSelection}
        onNodeSelect={setSelectedNode}
      />

      <RightInspector selectedNode={selectedNode} />
    </div>
  );
}
