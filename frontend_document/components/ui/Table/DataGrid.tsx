'use client';
import React, { useState, useEffect } from 'react';
import { Button, Pagination, Table, Dropdown, Checkbox } from 'antd';
import type { TableColumnsType, TableProps, MenuProps } from 'antd';
import useSWR from 'swr';
import { IIndexResponse } from '@/types/global';
import Searchbar from './Searchbar';
import { CirclePlus, Settings } from 'lucide-react';

type DataGridProps<T> = {
    rowSelection?: TableProps<T>['rowSelection'];
    columns: TableColumnsType<T>;
    rowKey: keyof T;
    fetcher?: (search: string, page: number, limit: number) => Promise<IIndexResponse<T>>;
    nameTable?: string;
    btnAddInfo?: {
        title: string;
        onClick: () => void;
    };
    singleSelect?: boolean;
    onSelectionChange?: (selected: T | null) => void;
    enableColumnFilter?: boolean; // Tùy chọn bật/tắt column filter
    defaultColumns?: string[]; // Danh sách các cột hiển thị mặc định (nếu không có sẽ hiển thị tất cả)
    columnFilterConfig?: {
        saveToLocalStorage?: boolean; // Lưu cấu hình vào localStorage
        storageKey?: string; // Key để lưu trong localStorage
    };
};

const DataGrid = <T extends object>({
    rowSelection,
    columns,
    rowKey,
    fetcher,
    nameTable,
    btnAddInfo,
    singleSelect = false,
    onSelectionChange,
    enableColumnFilter = true,
    defaultColumns = [],
    columnFilterConfig,
}: DataGridProps<T>) => {
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [searchText, setSearchText] = useState('');
    const [selectedKey, setSelectedKey] = useState<React.Key | null>(null);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);

    // Column filter states
    const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
    const [availableColumns, setAvailableColumns] = useState<{ key: string, title: string }[]>([]);

    // Generate storage key for localStorage
    const storageKey = columnFilterConfig?.storageKey || `dataGrid_${nameTable}_hiddenColumns`;

    // Load hidden columns from localStorage or use default
    const loadHiddenColumns = (): Set<string> => {
        if (columnFilterConfig?.saveToLocalStorage && typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem(storageKey);
                if (saved) {
                    const savedArray = JSON.parse(saved) as string[];
                    return new Set(savedArray);
                }
            } catch (error) {
                console.warn('Failed to load hidden columns from localStorage:', error);
            }
        }
        return new Set();
    };

    // Save hidden columns to localStorage
    const saveHiddenColumns = (hiddenCols: Set<string>) => {
        if (columnFilterConfig?.saveToLocalStorage && typeof window !== 'undefined') {
            try {
                localStorage.setItem(storageKey, JSON.stringify(Array.from(hiddenCols)));
            } catch (error) {
                console.warn('Failed to save hidden columns to localStorage:', error);
            }
        }
    };

    // Initialize available columns và load hidden columns
    useEffect(() => {
        const cols = columns
            .filter(col => col.key && col.title) // Chỉ lấy các column có key và title
            .map(col => ({
                key: col.key as string,
                title: typeof col.title === 'string' ? col.title : col.key as string
            }));
        setAvailableColumns(cols);

        // Load hidden columns after columns are available
        const loadInitialHiddenColumns = (): Set<string> => {
            if (columnFilterConfig?.saveToLocalStorage && typeof window !== 'undefined') {
                try {
                    const saved = localStorage.getItem(storageKey);
                    if (saved) {
                        const savedArray = JSON.parse(saved) as string[];
                        return new Set(savedArray);
                    }
                } catch (error) {
                    console.warn('Failed to load hidden columns from localStorage:', error);
                }
            }

            // Nếu có defaultColumns, ẩn các cột không có trong defaultColumns
            if (defaultColumns.length > 0) {
                const allColumnKeys = cols.map(col => col.key);
                const hiddenKeys = allColumnKeys.filter(key => !defaultColumns.includes(key));
                return new Set(hiddenKeys);
            }

            return new Set();
        };

        const initialHiddenColumns = loadInitialHiddenColumns();
        setHiddenColumns(initialHiddenColumns);
    }, [columns, storageKey, defaultColumns, columnFilterConfig?.saveToLocalStorage]);

    // Không cần internalReloadFlag để có thể mutate trực tiếp với key đơn giản

    const columnsWithSTT: TableColumnsType<T> = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: 50,
            align: 'center',
            render: (_: any, __: T, index: number) => (pageIndex - 1) * pageSize + index + 1,
        },
        ...columns.filter(col => !hiddenColumns.has(col.key as string)), // Filter out hidden columns
    ];
    const { data, isLoading, mutate: mutateSWR } = useSWR<IIndexResponse<T>>(
        [nameTable, searchText, pageIndex, pageSize] as const,
        async (args: readonly [string | undefined, string, number, number]) => {
            const [, search, page, limit] = args;
            if (fetcher) {
                return fetcher(search, page, limit);
            } else {
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    message: '',
                    data: [],
                    totalRecords: 0,
                    totalPages: 0,
                    currentPage: 1,
                    pageSize: limit,
                    IMeta: {},
                } as IIndexResponse<T>);
            }
        },
        { revalidateOnFocus: false }
    );    // Expose mutate function globally for external use

    useEffect(() => {
        if (nameTable) {
            (window as any)[`mutate_${nameTable}`] = () => {
                mutateSWR();
            };
        }
        return () => {
            if (nameTable) {
                delete (window as any)[`mutate_${nameTable}`];
            }
        };
    }, [nameTable, mutateSWR]);

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPageIndex(1);
    };

    const handleRowClick = (record: T) => {
        if (!singleSelect) return;
        const key = record[rowKey] as React.Key;
        setSelectedKey(key);
        setSelectedItem(record);
        onSelectionChange?.(record);
    };

    // Column filter functions
    const handleColumnToggle = (columnKey: string) => {
        const newHiddenColumns = new Set(hiddenColumns);
        if (newHiddenColumns.has(columnKey)) {
            newHiddenColumns.delete(columnKey);
        } else {
            newHiddenColumns.add(columnKey);
        }
        setHiddenColumns(newHiddenColumns);
        saveHiddenColumns(newHiddenColumns);
    };

    const handleShowAllColumns = () => {
        const newHiddenColumns = new Set<string>();
        setHiddenColumns(newHiddenColumns);
        saveHiddenColumns(newHiddenColumns);
    };

    const handleHideAllColumns = () => {
        const allColumnKeys = new Set(availableColumns.map(col => col.key));
        setHiddenColumns(allColumnKeys);
        saveHiddenColumns(allColumnKeys);
    };

    const handleResetToDefault = () => {
        // Nếu có defaultColumns, ẩn các cột không có trong defaultColumns
        if (defaultColumns.length > 0) {
            const allColumnKeys = availableColumns.map(col => col.key);
            const hiddenKeys = allColumnKeys.filter(key => !defaultColumns.includes(key));
            const defaultHidden = new Set(hiddenKeys);
            setHiddenColumns(defaultHidden);
            saveHiddenColumns(defaultHidden);
        } else {
            // Nếu không có defaultColumns, hiển thị tất cả
            const defaultHidden = new Set<string>();
            setHiddenColumns(defaultHidden);
            saveHiddenColumns(defaultHidden);
        }
    };

    // Create dropdown menu for column filter
    const columnFilterMenu: MenuProps = {
        items: [
            {
                key: 'actions',
                type: 'group',
                label: 'Hành động',
                children: [
                    {
                        key: 'show-all',
                        label: (
                            <div onClick={handleShowAllColumns} className="w-full">
                                Hiện tất cả cột
                            </div>
                        ),
                    },
                    {
                        key: 'hide-all',
                        label: (
                            <div onClick={handleHideAllColumns} className="w-full">
                                Ẩn tất cả cột
                            </div>
                        ),
                    },
                    ...(defaultColumns.length > 0 ? [{
                        key: 'reset-default',
                        label: (
                            <div onClick={handleResetToDefault} className="w-full">
                                Khôi phục mặc định
                            </div>
                        ),
                    }] : []),
                ],
            },
            {
                type: 'divider',
            },
            {
                key: 'columns',
                type: 'group',
                label: `Cột hiển thị (${availableColumns.length - hiddenColumns.size}/${availableColumns.length})`,
                children: availableColumns.map(col => ({
                    key: col.key,
                    label: (
                        <Checkbox
                            checked={!hiddenColumns.has(col.key)}
                            onChange={() => handleColumnToggle(col.key)}
                        >
                            {col.title}
                        </Checkbox>
                    ),
                })),
            },
        ],
    };

    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-2 mb-2">
                <div className="w-full md:w-auto flex items-center gap-2">
                    {btnAddInfo && (
                        <Button className="flex items-center gap-2" onClick={btnAddInfo?.onClick}>
                            <CirclePlus size={20} />
                            {btnAddInfo?.title || 'Thêm mới'}
                        </Button>
                    )}
                    {enableColumnFilter && availableColumns.length > 0 && (
                        <Dropdown
                            menu={columnFilterMenu}
                            trigger={['click']}
                            placement="bottomLeft"
                            open={showDropdown}
                        >
                            <Button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2">
                                <Settings size={16} />
                                Cột hiển thị
                            </Button>
                        </Dropdown>
                    )}
                </div>
                <div className="flex w-full justify-center md:justify-end">
                    <Searchbar setSearchText={handleSearch} />
                </div>
            </div>

            <div style={{ width: '100%', overflowX: 'auto' }}>
                <Table<T>
                    columns={columnsWithSTT}
                    dataSource={data?.data || []}
                    loading={isLoading}
                    rowKey={rowKey as string}
                    pagination={false}
                    rowSelection={
                        singleSelect
                            ? undefined
                            : {
                                type: 'checkbox',
                                ...rowSelection,
                            }
                    }
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                    })}
                    rowClassName={(record) => {
                        const key = record[rowKey];
                        return singleSelect && key === selectedKey
                            ? 'bg-blue-100 dark:bg-[#1e3a8a33]'
                            : '';
                    }}
                    bordered
                    scroll={{ x: 'max-content' }}
                    className="min-w-full"
                />
            </div>

            <div className="flex mt-5 items-center justify-between sm:justify-end">
                <Pagination
                    className="w-full flex justify-center sm:justify-end"
                    current={pageIndex}
                    pageSize={pageSize}
                    total={data?.totalRecords || 0}
                    showSizeChanger
                    showLessItems
                    pageSizeOptions={[1, 6, 10, 15, 20, 30]}
                    onShowSizeChange={(current, size) => {
                        setPageIndex(1);
                        setPageSize(size);
                    }}
                    onChange={(page) => setPageIndex(page)}
                />
            </div>
        </>
    );
};

export default DataGrid;
