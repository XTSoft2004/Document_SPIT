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
        <div className="flex justify-center items-center">
            <Input
                allowClear
                prefix={<SearchOutlined className="text-blue-500" />}
                placeholder="Tìm kiếm toàn bộ file hoặc thư mục..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-[150px] rounded-lg shadow-md px-3 py-2"
            />
        </div>
    );
};

export default Search;