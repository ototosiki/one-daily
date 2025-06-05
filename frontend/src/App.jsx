import { useState, useEffect } from 'react'
import EntryForm from './components/EntryForm'
import EntryList from './components/EntryList'

function App() {
  const [entries, setEntries] = useState([])
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/entries')
      .then((res) => res.json)
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .then(() => console.log(entries))
      .catch((err) => setError("投稿の取得に失敗しました"));
  }, []);

  const handleSubmit = async (text) => {
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
      setEntries([newEntry, ...entries]);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-4">今日のひとこと日記</h1>
      <EntryForm onSubmit={handleSubmit} />
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      <EntryList entries={entries} />
    </div>
  )
}

export default App;
