import { SearchEngineEnum } from './SearchService';

import imgIconGoogle from '../../../assets/img/icons/icon-logo-google.svg';
import imgIconBing from '../../../assets/img/icons/icon-logo-bing.svg';
import imgIconDuckDuckGo from '../../../assets/img/icons/icon-logo-duckduckgo.svg';

interface SearchEngineIndicatorProps {
  searchEngine: SearchEngineEnum;
}

export default function SearchEngineIndicator({
  searchEngine,
}: SearchEngineIndicatorProps) {
  const engineIcon: Record<SearchEngineEnum, string> = {
    [SearchEngineEnum.Google]: imgIconGoogle,
    [SearchEngineEnum.Bing]: imgIconBing,
    [SearchEngineEnum.DuckDuckGo]: imgIconDuckDuckGo,
  };

  return (
    <div className="absolute top-0 right-0 h-full px-2 py-1 z-20 inline-flex items-center rounded-r-lg text-sm font-medium text-center text-gray-800 bg-gray-100 focus:outline-none">
      <img className="w-4 h-4 mr-1" src={engineIcon[searchEngine]} />
    </div>
  );
}
