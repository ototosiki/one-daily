import { useState } from 'react';

const EntryForm = ({ onSubmit }) => {
    const [text, setText] = useState('');
    return (
    <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(text);
        setText('');
        }}
        className="p-4"
        >
            <textarea
                className="w-full p-2 border rounded resize-none"
                rows={3}
                maxLength={140}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="今日の一言をどうぞ"
                required
            />
            <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                投稿
            </button>
        </form>
    );
};

export default EntryForm;