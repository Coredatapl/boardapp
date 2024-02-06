interface QueryHistoryListItemProps {
  query: string;
  useSimilarQuery: (query: string) => void;
  deleteQuery: (query: string) => void;
}

export default function QueryHistoryListItem({
  query,
  useSimilarQuery,
  deleteQuery,
}: QueryHistoryListItemProps) {
  return (
    <li
      className="flex justify-start py-2 text-base hover:bg-gray-200 hover:text-gray-900 hover:cursor-pointer"
      onClick={() => {
        useSimilarQuery(query);
      }}
    >
      <div className="grid place-items-center text-gray-700 w-12">
        <i className="fa-solid fa-clock-rotate-left"></i>
      </div>
      <div className="">{query}</div>
      <div
        className={`absolute right-2 mb-1 grid place-items-center items-center align-middle cursor-pointer text-gray-700`}
        onClick={() => deleteQuery(query)}
        title="Delete query"
      >
        <i className="fa-solid fa-xmark w-8 h-8 p-2 transition-all transform ease-in-out hover:w-9 hover:h-9"></i>
      </div>
    </li>
  );
}
