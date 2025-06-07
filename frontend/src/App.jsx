import { useState, useEffect, useMemo } from 'react'
import EntryForm from './components/EntryForm'
import EntryList from './components/EntryList'
import SearchBar from './components/SearchBar'
import DatePicker from './components/DatePicker'

function App() {
  const [entries, setEntries] = useState([])
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const dailyLimit = 10;

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesSearchTerm = entry.text.toLowerCase().includes(searchTerm.toLowerCase());
      
      const entryDate = entry.date ? entry.date.split('T')[0] : null;
      const matchesDate = !selectedDate || entryDate === selectedDate;
      
      return matchesSearchTerm && matchesDate;
    });
  }, [entries, searchTerm, selectedDate]);

  const todaysEntriesCount = useMemo(() => {
    const today = new Date();
    const todayDateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    return entries.filter(entry => {
        if (!entry.date) return false;
        const entryDate = new Date(entry.date);
        const entryDateString = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}-${String(entryDate.getDate()).padStart(2, '0')}`;
        return entryDateString === todayDateString;
    }).length;
  }, [entries]);

  const isLimitReached = todaysEntriesCount >= dailyLimit;

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/entries');
        if (!res.ok) {
          throw new Error('Failed to fetch entries');
        }
        const data = await res.json();
        setEntries(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch entries');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const handleSubmit = async (text) => {
    if (isLimitReached) {
      setError(`The daily entry limit of ${dailyLimit} has been reached.`);
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "投稿に失敗しました");
      }
      const newEntry = await response.json();
      setEntries(prev => [newEntry, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    // Optimistic UI update
    const originalEntries = [...entries];
    setEntries(prev => prev.filter(entry => entry._id !== id));

    try {
      const response = await fetch(`http://localhost:3001/api/entries/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Revert on failure
        setEntries(originalEntries);
        setError('Failed to delete entry. Please try again.');
      }
    } catch (err) {
      // Revert on failure
      setEntries(originalEntries);
      setError('Failed to delete entry. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-gray-300">
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fadeIn">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-100 mb-3">
            Daily Journal
          </h1>
          <p className="text-gray-400 mt-2">Record your daily thoughts and moments</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          <div>
            <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-2xl border border-slate-700/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-100">New Entry</h2>
            <span className={`text-sm font-medium ${isLimitReached ? 'text-red-500' : 'text-gray-400'}`}>
              {`Today's entries: ${todaysEntriesCount} / ${dailyLimit}`}
            </span>
          </div>
          <EntryForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
            isLimitReached={isLimitReached}
          />
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 rounded-md border border-red-500/30 animate-shake">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-100">Past Entries</h2>
            <span className="text-sm text-gray-400">{filteredEntries.length} entries found</span>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-md rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl border border-slate-700/50">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-react-blue"></div>
              </div>
            ) : (
              <EntryList entries={filteredEntries} onDelete={handleDelete} searchTerm={searchTerm} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
