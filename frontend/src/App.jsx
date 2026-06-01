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
    // Sol panelden cikan mock sonucu tutup orta kanvasa (CenterCanvas) aktaracak olan ortak state
    const [algoResult, setAlgoResult] = useState(null);

    return (
        <div className="app-shell">
            <Topbar />

            {/* onAlgorithmResult prop'una state degistirme fonksiyonumuzu bagliyoruz */}
            <LeftPanel onAlgorithmResult={setAlgoResult} />

            {/* algorithmResult prop'una guncel state verisini pasliyoruz */}
            <CenterCanvas algorithmResult={algoResult} />

            <RightInspector />
        </div>
    );
}