import { useState } from 'react';

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

const Highlight = ({ text, highlight }) => {
    if (!highlight.trim()) {
        return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
        <span>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark key={i} className="bg-react-blue/30 text-white rounded px-1">
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
};

export default function EntryList({ entries, onDelete, searchTerm }) {
    const [deletingId, setDeletingId] = useState(null);

    if (!Array.isArray(entries)) {
        entries = [];
    }

    if (entries.length === 0) {
        return (
            <div className="p-8 text-center text-gray-400">
                <p>No entries found.</p>
                {searchTerm && <p className="text-sm mt-2">Try a different search term.</p>}
            </div>
        );
    }

    const handleDeleteClick = (id) => {
        setDeletingId(id);
    };

    const handleConfirmDelete = (id) => {
        onDelete(id);
        setDeletingId(null);
    };

    const handleCancelDelete = () => {
        setDeletingId(null);
    };

    return (
        <ul className="divide-y divide-slate-700">
            {entries.map((entry) => (
                <li 
                    key={entry._id} 
                    className="p-6 transition-all duration-300 ease-in-out hover:bg-slate-700/50 relative group"
                >
                    <div className="space-y-3">
                        <p className="text-gray-200 text-lg leading-relaxed">
                            <Highlight text={entry.text} highlight={searchTerm} />
                        </p>
                        <div className="flex items-center justify-between text-sm">
                            <time className="text-gray-400">
                                {formatDate(entry.date)}
                            </time>
                            {deletingId === entry._id ? (
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-400">Are you sure?</span>
                                    <button 
                                        onClick={() => handleConfirmDelete(entry._id)}
                                        className="text-red-500 hover:text-red-400 font-semibold"
                                    >
                                        Yes
                                    </button>
                                    <button 
                                        onClick={handleCancelDelete}
                                        className="text-gray-400 hover:text-gray-200"
                                    >
                                        No
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => handleDeleteClick(entry._id)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    aria-label="Delete entry"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
