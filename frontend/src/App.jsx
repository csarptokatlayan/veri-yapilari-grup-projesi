import './App.css';
import Topbar from './Topbar';
import LeftPanel from './LeftPanel';
import CenterCanvas from './CenterCanvas';
import RightInspector from './RightInspector';
import React, { useState } from 'react';

// KİŞİ 4 - F3-US1: TRIE ARAMA BARI BİLEŞENİ
function TrieSearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === '') {
            setResults([]);
            return;
        }
        try {
            // Bizim Spring Boot SearchController endpoint'ine istek atıyoruz
            const response = await fetch(`http://localhost:8080/api/search?prefix=${value}`);
            const data = await response.json();
            setResults(data); // Trie'den dönen eşleşen ID listesini state'e atıyoruz
        } catch (error) {
            console.error("Trie arama hatası:", error);
        }
    };

    return (
        <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, background: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <input
                type="text"
                placeholder="Düğüm (Prefix) ara..."
                value={query}
                onChange={handleSearch}
                style={{ width: '250px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            {results.length > 0 && (
                <ul style={{ listStyle: 'none', margin: '5px 0 0 0', padding: '5px', maxHeight: '200px', overflowY: 'auto', borderTop: '1px solid #eee' }}>
                    {results.map((id) => (
                        <li
                            key={id}
                            style={{ padding: '6px', cursor: 'pointer', borderBottom: '1px solid #f9f9f9' }}
                            onClick={() => {
                                alert(`Seçilen Düğüm ID: ${id}. (Kişi 3'ün Canvas'ında bu düğüm parlayacak)`);
                                // Entegrasyon Adımı: Kişi 3'ün cytoscape veya d3 objesindeki node'u burada tetikleyeceğiz
                            }}
                        >
                            🔍 Düğüm ID: <strong>{id}</strong>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

/**
 * Butun siniflarin calistirildigi ana dosya.
 * @author Semih Tuncel
 */
export default function App() {
  return (
    <div className="app-shell">
      <Topbar />
      <LeftPanel />
      <CenterCanvas />
      <RightInspector />
    </div>
  );
}
