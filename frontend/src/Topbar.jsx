import { useEffect, useState } from 'react';

const SEARCH_MIN_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 300;
const BLUR_CLOSE_DELAY_MS = 120;

/**
 * Arama endpoint cevabini listeye indirger; backend sozlesmesi esnek kalsin diye secildi.
 * @author Semih Tuncel
 */
function normalizeSearchResults(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.nodes)) {
    return payload.nodes;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
}

/**
 * Arama sorgusunu backend'e yollar; AbortController ile eski istekler iptal edilir.
 * @author Semih Tuncel
 */
async function fetchSearchResults(query, signal) {
  const encodedQuery = encodeURIComponent(query);
  const response = await fetch(`/nodes/search?q=${encodedQuery}`, { signal });

  if (!response.ok) {
    throw new Error(`Arama yuklenemedi: ${response.status}`);
  }

  return normalizeSearchResults(await response.json());
}

/**
 * Node basligini guvenli metne cevirir; dropdown satirlari bos kalmasin diye secildi.
 * @author Semih Tuncel
 */
function getSearchNodeTitle(node) {
  return String(node?.title ?? node?.label ?? node?.name ?? node?.id ?? 'Untitled');
}

/**
 * Node kimligini guvenli metne cevirir; secim ve satir anahtari ayni kaynaktan beslenir.
 * @author Semih Tuncel
 */
function getSearchNodeId(node) {
  return String(node?.id ?? node?.ID ?? node?.nodeId ?? getSearchNodeTitle(node));
}

/**
 * Node tipini guvenli metne cevirir; backend type alan adlari degisse de UI okunur kalir.
 * @author Semih Tuncel
 */
function getSearchNodeType(node) {
  return String(node?.nodeType ?? node?.type ?? 'UNKNOWN');
}

/**
 * Ust arama cubugu, logo ve durum gostergesi ile kontrollu arama dropdown'unu yonetir.
 * @author Semih Tuncel
 */
export default function Topbar({ onSearchResultSelect }) {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState('idle');
  const [searchError, setSearchError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const trimmedSearchText = searchText.trim();
  const canSearch = trimmedSearchText.length >= SEARCH_MIN_LENGTH;
  const shouldShowDropdown = isDropdownOpen && canSearch;

  useEffect(() => {
    if (!canSearch) {
      return undefined;
    }

    const abortController = new AbortController();
    const timeoutId = window.setTimeout(() => {
      fetchSearchResults(trimmedSearchText, abortController.signal)
          .then((results) => {
            if (abortController.signal.aborted) {
              return;
            }

            setSearchResults(results);
            setSearchStatus('success');
          })
          .catch((error) => {
            if (error.name === 'AbortError') {
              return;
            }

            setSearchResults([]);
            setSearchStatus('error');
            setSearchError('Arama hatasi');
            console.error('Arama sonucu yuklenemedi', error);
          });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [canSearch, trimmedSearchText]);

  /**
   * Input metnini gunceller; yazmak kanvasa herhangi bir komut gondermez.
   * @author Semih Tuncel
   */
  function handleSearchTextChange(event) {
    const nextSearchText = event.target.value;
    const nextCanSearch = nextSearchText.trim().length >= SEARCH_MIN_LENGTH;

    setSearchText(nextSearchText);

    if (nextCanSearch) {
      setSearchStatus('loading');
      setSearchError('');
      setIsDropdownOpen(true);
      return;
    }

    setSearchResults([]);
    setSearchStatus('idle');
    setSearchError('');
    setIsDropdownOpen(false);
  }

  /**
   * Focus sirasinda hazir sonuc varsa dropdown'u geri acar.
   * @author Semih Tuncel
   */
  function handleSearchFocus() {
    if (canSearch) {
      setIsDropdownOpen(true);
    }
  }

  /**
   * Blur sonrasi tiklama islemi tamamlansin diye dropdown'u kisa gecikmeyle kapatir.
   * @author Semih Tuncel
   */
  function handleSearchBlur() {
    window.setTimeout(() => {
      setIsDropdownOpen(false);
    }, BLUR_CLOSE_DELAY_MS);
  }

  /**
   * Klavye ile Escape kapatma akisini yonetir.
   * @author Semih Tuncel
   */
  function handleSearchKeyDown(event) {
    if (event.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  }

  /**
   * Dropdown secimini App'e bildirir; kanvas temizleme kararini ust state verir.
   * @author Semih Tuncel
   */
  function handleResultClick(node) {
    setSearchText(getSearchNodeTitle(node));
    setIsDropdownOpen(false);
    onSearchResultSelect?.(node);
  }

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <svg className="brand-icon" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="2.5" fill="#5b8af0" />
          <circle cx="3.5" cy="5.5" r="2" stroke="#3a5fd6" strokeWidth="1.2" />
          <circle cx="18.5" cy="5.5" r="2" stroke="#3a5fd6" strokeWidth="1.2" />
          <circle cx="3.5" cy="16.5" r="2" stroke="#3a5fd6" strokeWidth="1.2" />
          <circle cx="18.5" cy="16.5" r="2" stroke="#3a5fd6" strokeWidth="1.2" />
          <line x1="5.3" y1="6.8" x2="9.2" y2="10" stroke="#2a3550" strokeWidth="1.1" />
          <line x1="12.8" y1="10" x2="16.7" y2="6.8" stroke="#2a3550" strokeWidth="1.1" />
          <line x1="5.3" y1="15.2" x2="9.2" y2="12" stroke="#2a3550" strokeWidth="1.1" />
          <line x1="12.8" y1="12" x2="16.7" y2="15.2" stroke="#2a3550" strokeWidth="1.1" />
        </svg>
        <span className="brand-name">PropertyGraph</span>
        <span className="brand-version">v0.1</span>
      </div>

      <div className="topbar-sep" />

      <div className="topbar-search-wrap">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.3" />
          <line x1="7.8" y1="7.8" x2="11" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <input
          className="topbar-search"
          type="text"
          placeholder="Dugum ara... (ID, label, property)"
          value={searchText}
          onBlur={handleSearchBlur}
          onChange={handleSearchTextChange}
          onFocus={handleSearchFocus}
          onKeyDown={handleSearchKeyDown}
          spellCheck={false}
        />

        {shouldShowDropdown && (
          <div className="topbar-search-dropdown">
            {searchStatus === 'loading' && (
              <div className="search-dropdown-state">Yukleniyor...</div>
            )}

            {searchStatus === 'error' && (
              <div className="search-dropdown-state error">{searchError}</div>
            )}

            {searchStatus === 'success' && searchResults.length === 0 && (
              <div className="search-dropdown-state">Sonuc yok</div>
            )}

            {searchStatus === 'success' && searchResults.length > 0 && (
              <div className="search-dropdown-list">
                {searchResults.map((node) => (
                  <button
                    className="search-dropdown-row"
                    key={getSearchNodeId(node)}
                    type="button"
                    onClick={() => handleResultClick(node)}
                  >
                    <span className="search-row-title">{getSearchNodeTitle(node)}</span>
                    <span className="search-row-meta">
                      #{getSearchNodeId(node)} - {getSearchNodeType(node)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="topbar-meta">
        <div className="status-dot" />
        <span className="status-label">READY</span>
      </div>
    </header>
  );
}
