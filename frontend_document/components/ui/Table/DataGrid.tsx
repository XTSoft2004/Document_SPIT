'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
}: DataGridProps<T>) => {
    // Basic states
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [searchText, setSearchText] = useState('');
    const [selectedKey, setSelectedKey] = useState<React.Key | null>(null);

    // Column filter states
    const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());

    const availableColumns = useMemo(() =>
        columns
            .filter(col => col.key && col.title)
            .map(col => ({
                key: col.key as string,
                title: typeof col.title === 'string' ? col.title : col.key as string
            })),
        [columns]
    );

    // Initialize hidden columns với defaultColumns
    useEffect(() => {
        if (defaultColumns.length > 0) {
            const defaultHidden = new Set(
                availableColumns.filter(col => !defaultColumns.includes(col.key)).map(col => col.key)
            );
            setHiddenColumns(defaultHidden);
        }
    }, [defaultColumns, availableColumns]);

    // Memoized filtered columns
    const columnsWithSTT = useMemo((): TableColumnsType<T> => {
        return [
            {
                title: 'STT',
                dataIndex: 'stt',
                key: 'stt',
                width: 50,
                align: 'center',
                render: (_: any, __: T, index: number) => (pageIndex - 1) * pageSize + index + 1,
            },
            ...columns.filter(col => !hiddenColumns.has(col.key as string)),
        ];
    }, [columns, hiddenColumns, pageIndex, pageSize]);
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

    // Event handlers
    const handleSearch = useCallback((value: string) => {
        setSearchText(value);
        setPageIndex(1);
    }, []);

    const handleRowClick = useCallback((record: T) => {
        if (!singleSelect) return;
        const key = record[rowKey] as React.Key;
        setSelectedKey(key);
        onSelectionChange?.(record);
    }, [singleSelect, rowKey, onSelectionChange]);

    // Column filter handlers
    const handleColumnToggle = useCallback((columnKey: string) => {
        const newHiddenColumns = new Set(hiddenColumns);
        if (newHiddenColumns.has(columnKey)) {
            newHiddenColumns.delete(columnKey);
        } else {
            newHiddenColumns.add(columnKey);
        }
        setHiddenColumns(newHiddenColumns);
    }, [hiddenColumns]);

    const handleShowAllColumns = useCallback(() => {
        const newHiddenColumns = new Set<string>();
        setHiddenColumns(newHiddenColumns);
    }, []);

    const handleHideAllColumns = useCallback(() => {
        const allColumnKeys = new Set(availableColumns.map(col => col.key));
        setHiddenColumns(allColumnKeys);
    }, [availableColumns]);

    const handleResetToDefault = useCallback(() => {
        const defaultHidden = defaultColumns.length > 0
            ? new Set(availableColumns.filter(col => !defaultColumns.includes(col.key)).map(col => col.key))
            : new Set<string>();
        setHiddenColumns(defaultHidden);
    }, [defaultColumns, availableColumns]);

    // Memoized dropdown menu
    const columnFilterMenu: MenuProps = useMemo(() => ({
        items: [
            {
                key: 'actions',
                type: 'group',
                label: 'Hành động',
                children: [
                    {
                        key: 'show-all',
                        label: <div onClick={handleShowAllColumns}>Hiện tất cả cột</div>,
                    },
                    {
                        key: 'hide-all',
                        label: <div onClick={handleHideAllColumns}>Ẩn tất cả cột</div>,
                    },
                    ...(defaultColumns.length > 0 ? [{
                        key: 'reset-default',
                        label: <div onClick={handleResetToDefault}>Khôi phục mặc định</div>,
                    }] : []),
                ],
            },
            { type: 'divider' },
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
    }), [availableColumns, hiddenColumns, handleShowAllColumns, handleHideAllColumns, handleResetToDefault, handleColumnToggle, defaultColumns.length]);

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
                </div>
                <div className="flex w-full justify-center md:justify-end">
                    {enableColumnFilter && availableColumns.length > 0 && (
                        <Dropdown
                            className='mr-2'
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
                    onShowSizeChange={useCallback((current: number, size: number) => {
                        setPageIndex(1);
                        setPageSize(size);
                    }, [])}
                    onChange={useCallback((page: number) => setPageIndex(page), [])}
                />
            </div>
        </>
    );
};

export default DataGrid;
