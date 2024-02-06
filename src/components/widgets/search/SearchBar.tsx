import { useEffect, useRef, useState } from 'react';
import { KeyboardEvent } from 'react';
import { CacheApi } from '../../../utils/cache/CacheApi';
import { useUtil } from '../../../utils/useUtil';
import SearchEngineSelector from './SearchEngineSelector';
import { SearchEngineEnum, SearchService } from './SearchService';
import QueryHistoryListItem from './QueryHistoryListItem';

export default function SearchBar() {
  const [showQueryHistory, setShowQueryHistory] = useState(false);
  const [similarQueries, setSimilarQueries] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [placeHolder, setPlaceHolder] = useState('Search the web...');
  const [searchEngine, setSearchEngine] = useState(SearchEngineEnum.Google);
  const { targetInside } = useUtil();
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchService = new SearchService(new CacheApi());
  const minQueryLength = searchService.minQueryLength;

  function inputFocus() {
    (document.getElementById('searchQueryInput') as HTMLInputElement).focus();
  }

  function getSimilarQueries(input: string): void {
    const queries = searchService.getSimilarQueries(input);
    if (!queries.length) {
      return;
    }
    setSimilarQueries(queries);
  }

  function useSimilarQuery(query: string) {
    if (query.length) {
      setQuery(query);
    }
    setShowQueryHistory(false);
    inputFocus();
  }

  function deleteQuery(query: string) {
    searchService.delQuery(query);
    setSimilarQueries(similarQueries.filter((v) => v !== query));
  }

  function handleOnLoad() {
    inputFocus();
  }

  function handleClick(event: MouseEvent) {
    if (!searchBarRef.current || !event.target) {
      return;
    }

    const searchInput = document.getElementById(
      'searchQueryInput'
    ) as HTMLInputElement;
    if (!targetInside(event.target, searchBarRef.current)) {
      setShowQueryHistory(false);
    } else if (searchInput.value.length >= minQueryLength) {
      getSimilarQueries(searchInput.value);
      setShowQueryHistory(true);
    }
  }

  function handleKeyUp(e: KeyboardEvent) {
    const key = e.key;
    const searchQuery = (
      document.getElementById('searchQueryInput') as HTMLInputElement
    ).value;

    if (searchQuery.length < minQueryLength) {
      setShowQueryHistory(false);
      return;
    }

    if (key === 'Enter') {
      searchService.saveQuery(query);
      window.location.href =
        searchService.getSearchUrl(searchEngine) +
        encodeURIComponent(searchQuery);
      return;
    }
    if (searchQuery.length >= minQueryLength) {
      getSimilarQueries(searchQuery);
      setShowQueryHistory(true);
    } else {
      setShowQueryHistory(false);
    }
  }

  useEffect(() => {
    document.addEventListener('load', handleOnLoad, true);
    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return (
    <div
      className={`relative w-10/12 md:w-6/12 max-w-2xl mx-auto`}
      ref={searchBarRef}
    >
      <div
        className={`relative flex w-full z-10 items-center bg-white/70 text-gray-800 hover:bg-gray-100 hover:text-gray-700 backdrop-blur-sm ${
          showQueryHistory
            ? 'rounded-t-lg border-b border-gray-200'
            : 'shadow-lg rounded-lg'
        } app-state-focused`}
      >
        <div className="w-12 h-full px-3 place-items-center text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          className="peer w-full h-full outline-none appearance-none text-lg pr-2 py-3 bg-transparent"
          type="text"
          id="searchQueryInput"
          placeholder={placeHolder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyUp={(e) => handleKeyUp(e)}
          onFocus={() => {
            setPlaceHolder('Type what you are looking for and press Enter');
            setFocused(true);
          }}
          onBlur={() => {
            setPlaceHolder('Search the web...');
            setFocused(false);
          }}
        />
        <SearchEngineSelector
          searchEngine={searchEngine}
          setSearchEngine={setSearchEngine}
        />
      </div>

      {showQueryHistory && (
        <div
          className={`absolute top-40-px z-10 flex w-full rounded-b-lg shadow-lg overflow-hidden items-center bg-white/70 text-gray-800 app-state-focused`}
        >
          <ul className="list-none w-full">
            {similarQueries.map((query, idx) => (
              <QueryHistoryListItem
                key={idx}
                query={query}
                useSimilarQuery={useSimilarQuery}
                deleteQuery={deleteQuery}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
