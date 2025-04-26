export default function Uploading() {
  return (
    <div className="container">
      <div className="flex-1  flex flex-col items-center p-4 border-2 rounded-md border-dashed border-gray-300 bg-gray-100 font-semibold cursor-not-allowed opacity-50">
        <div className="flex flex-col items-center justify-center">
          <svg
            className="mb-4 h-8 w-8 text-gray-400 dark:text-gray-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-400 dark:text-gray-300">
            <span className="font-semibold">Uploading Image...</span>
          </p>
          <p className="text-xs text-gray-400 invisible dark:text-gray-300">
            PNG, JPG
          </p>
        </div>
      </div>
    </div>
  );
}
