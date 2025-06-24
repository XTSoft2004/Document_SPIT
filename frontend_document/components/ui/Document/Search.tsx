import { useState, useEffect } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { IDriveItem } from "@/types/driver";

interface SearchProps {
    allItems: IDriveItem[]; // toàn bộ file/folder (flatten)
    onResult: (results: IDriveItem[] | null) => void;
}

const Search = ({ allItems, onResult }: SearchProps) => {
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (!query.trim()) {
            onResult(null);
        } else {
            const lower = query.toLowerCase();
            const filtered = allItems.filter(item =>
                item.name.toLowerCase().includes(lower)
            );
            onResult(filtered);
        }
    }, [query, allItems, onResult]);

    return (
        <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm toàn bộ file hoặc thư mục..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="mb-2"
        />
    );
};

export default Search;