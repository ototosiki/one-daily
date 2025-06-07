import { useState } from 'react';

const EntryForm = ({ onSubmit, isSubmitting, isLimitReached }) => {
    const [text, setText] = useState('');
    const [charCount, setCharCount] = useState(0);

    const handleChange = (e) => {
        const newText = e.target.value;
        setText(newText);
        setCharCount(newText.length);
    };

    return (
        <form 
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(text);
                setText('');
                setCharCount(0);
            }}
            className="space-y-4"
        >
            <div className="relative">
                <textarea
                    className="w-full p-4 border border-slate-600 bg-slate-700/50 text-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-react-blue focus:border-transparent transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400"
                    rows={4}
                    maxLength={140}
                    value={text}
                    onChange={handleChange}
                    placeholder={isLimitReached ? "You have reached the daily entry limit" : "What's on your mind today?"}
                    required
                    disabled={isSubmitting || isLimitReached}
                />
                <div className="absolute bottom-3 right-3 text-sm text-gray-500">
                    {charCount}/140
                </div>
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={text.trim().length === 0 || isSubmitting || isLimitReached}
                    className="relative px-6 py-2.5 bg-react-blue text-white rounded-lg hover:bg-react-blue-dark active:scale-95 disabled:bg-slate-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 ease-in-out font-medium"
                >
                    {isSubmitting ? (
                        <>
                            <span className="opacity-0">Post Entry</span>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            </div>
                        </>
                    ) : (
                        "Post Entry"
                    )}
                </button>
            </div>
        </form>
    );
};

export default EntryForm;