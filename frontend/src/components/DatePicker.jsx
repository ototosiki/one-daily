const DatePicker = ({ selectedDate, setSelectedDate }) => {
  return (
    <div className="relative">
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="w-full h-[46px] pl-3 pr-10 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-react-blue focus:border-transparent transition-all"
        style={{ colorScheme: 'dark' }}
      />
      {selectedDate && (
        <button
          onClick={() => setSelectedDate('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          aria-label="Clear date"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default DatePicker; 