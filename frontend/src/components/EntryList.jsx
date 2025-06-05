export default function EntryList({ entries }) {
    if (!Array.isArray(entries)) {
        entries = [{ text: "データの取得に失敗しました", date: "2025-06-05" }];
    };
    return (
        <ul className="p-4 space-y-2">
            {entries.map((entry, i) => (
                <li key={i} className="p-2 border rounded shadow">
                    <div className="text-gray-700">{entry.text}</div>
                    <div className="text-sm text-gray-400">{entry.date}</div>
                </li>
            ))}
        </ul>
    )
}
