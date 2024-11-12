import imgLogo from '../../assets/img/logo-color.svg';

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen app-wrapper">
      <div className="flex flex-col items-center justify-center grow text-gray-600 bg-gray-100">
        <div className="flex flex-row mb-4">
          <img src={imgLogo} alt="Board App" width={150} height={25} />
        </div>
        <div className="flex flex-row items-center justify-center text-lg font-semibold">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading ...
        </div>
      </div>
    </div>
  );
}
