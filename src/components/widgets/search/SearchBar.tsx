import { useEffect, useRef, useState } from 'react';
import { KeyboardEvent } from 'react';
import { CacheApi } from '../../../utils/cache/CacheApi';
import { useGlobalState } from '../../../hooks/useGlobalState';
import Button from '../../common/Button';
import SearchEngineSelector from './SearchEngineSelector';
import QueryHistoryListItem from './QueryHistoryListItem';
import { SearchEngineEnum, SearchService } from './SearchService';
import SearchEngineIndicator from './SearchEngineIndicator';
import { useUi } from '../../../hooks/useUI';

// TODO: One search engine (Chrome Search Api) with enhanced UI
export default function SearchBar() {
  const { setGlobalState } = useGlobalState();
  const { animateResize } = useUi();
  const [showQueryHistory, setShowQueryHistory] = useState(false);
  const [similarQueries, setSimilarQueries] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [placeHolder, setPlaceHolder] = useState('Search the web...');
  const [searchEngine, setSearchEngine] = useState(SearchEngineEnum.Google);
  const searchService = new SearchService(new CacheApi());
  const minQueryLength = searchService.minQueryLength;
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchButtonsRef = useRef<HTMLDivElement>(null);

  function inputFocus() {
    (document.getElementById('searchQueryInput') as HTMLInputElement).focus();
    setFocused(true);
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

  function submitQuery() {
    if (query.length < minQueryLength) {
      return;
    }
    searchService.saveQuery(query);
    window.location.href =
      searchService.getSearchUrl(searchEngine) + encodeURIComponent(query);
  }

  function cancelQuery() {
    setQuery('');
    setShowQueryHistory(false);
    setFocused(false);
  }

  function deleteQuery(query: string) {
    searchService.delQuery(query);
    setSimilarQueries(similarQueries.filter((v) => v !== query));
  }

  function handleKeyUp(e: KeyboardEvent) {
    const key = e.key;

    if (query.length < minQueryLength) {
      setShowQueryHistory(false);
      return;
    }

    if (key === 'Enter') {
      submitQuery();
      return;
    }
    if (query.length >= minQueryLength) {
      getSimilarQueries(query);
      setShowQueryHistory(true);
    } else {
      setShowQueryHistory(false);
    }
  }

  useEffect(() => {
    if (focused) {
      setGlobalState((state) => ({
        ...state,
        widgetShortcutsHidden: true,
      }));
      animateResize(searchButtonsRef.current, 500);
    } else {
      animateResize(searchButtonsRef.current, 500, true);
      setTimeout(() => {
        setGlobalState((state) => ({
          ...state,
          widgetShortcutsHidden: focused || showQueryHistory,
        }));
      }, 300);
    }
  }, [focused]);

  return (
    <div
      className={`relative w-10/12 md:w-6/12 max-w-2xl mx-auto`}
      ref={searchBarRef}
    >
      <div
        className={`relative flex flex-col w-full z-10 items-center bg-white/70 text-gray-800 hover:bg-gray-100 hover:text-gray-700 backdrop-blur-sm shadow-lg rounded-lg app-state-focused`}
      >
        <div className="relative flex w-full h-full">
          <div className="w-12 h-full px-3 place-items-center text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mt-3"
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
            id="searchQueryInput"
            type="text"
            role="combobox"
            placeholder={placeHolder}
            value={query}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            autoFocus={false}
            spellCheck={false}
            aria-autocomplete="both"
            aria-haspopup={false}
            onChange={(e) => setQuery(e.target.value)}
            onKeyUp={(e) => handleKeyUp(e)}
            onFocus={() => {
              setPlaceHolder('Type what you are looking for and press Enter');
              setFocused(true);
            }}
            onBlur={() => {
              setPlaceHolder('Search the web...');
            }}
          />
          <SearchEngineIndicator searchEngine={searchEngine} />
        </div>

        <div
          className={`relative flex w-full overflow-hidden items-center bg-white/70 text-gray-800 app-state-focused transition-maxheight duration-500 ease-in-out ${
            showQueryHistory ? 'max-h-screen z-3' : 'max-h-0 z-0'
          }`}
        >
          <ul className={`relative list-none w-full`}>
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

        <div
          ref={searchButtonsRef}
          className={`flex w-full h-full max-h-screen overflow-hidden`}
        >
          <div
            className={`relative flex w-full overflow-hidden items-center ${
              focused || showQueryHistory ? 'z-3' : 'z-0'
            }`}
          >
            <div className="relative flex w-full gap-4 p-2 justify-center">
              <Button
                title="Search"
                type="button"
                onClick={submitQuery}
                style="md:w-3/12 border border-gray-200 font-semibold shadow-none text-gray-500 bg-gray-100 hover:text-gray-700 hover:bg-gray-200 active:bg-gray-200 active:shadow-none"
              />
              <Button
                type="button"
                title="Cancel"
                onClick={cancelQuery}
                style="md:w-3/12 border border-gray-200 font-semibold shadow-none text-gray-500 bg-gray-100 hover:text-red-700 hover:bg-gray-200 active:bg-gray-200 active:shadow-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
