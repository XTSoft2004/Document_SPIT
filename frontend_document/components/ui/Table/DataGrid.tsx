'use client';
import React, { useState } from 'react';
import { Button, Pagination, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import useSWR from 'swr';
import { IIndexResponse } from '@/types/global';
import Searchbar from './Searchbar';
import { CirclePlus } from 'lucide-react';

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
}: DataGridProps<T>) => {
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(7);
    const [searchText, setSearchText] = useState('');
    const [selectedKey, setSelectedKey] = useState<React.Key | null>(null);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);

    const columnsWithSTT: TableColumnsType<T> = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: 50,
            align: 'center',
            render: (_: any, __: T, index: number) => (pageIndex - 1) * pageSize + index + 1,
        },
        ...columns,
    ];

    const { data, isLoading } = useSWR<IIndexResponse<T>>(
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
    );

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

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-2 mb-2">
                {btnAddInfo && (
                    <div className="w-full md:w-auto flex items-center gap-2">
                        <Button className="w-full md:w-auto flex items-center gap-2" onClick={btnAddInfo?.onClick}>
                            <CirclePlus size={20} />
                            {btnAddInfo?.title || 'Thêm mới'}
                        </Button>
                    </div>
                )}
                <div className="flex w-full justify-center md:justify-end">
                    <Searchbar setSearchText={handleSearch} />
                </div>
            </div>

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
