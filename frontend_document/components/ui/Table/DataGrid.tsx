'use client';
import React, { useEffect, useState } from 'react';
import { Pagination, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import useSWR from 'swr';
import { IIndexResponse } from '@/types/global';
import Searchbar from './Searchbar';

// type FetcherResponse<T> = {
//     totalRecords: number;
//     totalPages: number;
//     currentPage: number;
//     pageSize: number;
//     data: T[];
// };

type DataGridProps<T> = {
    rowSelection?: TableProps<T>['rowSelection'];
    columns: TableColumnsType<T>;
    rowKey: keyof T;
    fetcher?: (search: string, page: number, limit: number) => Promise<IIndexResponse<T>>;
    nameTable?: string;
};

const DataGrid = <T extends object>({
    rowSelection,
    columns,
    rowKey,
    fetcher,
    nameTable,
}: DataGridProps<T>) => {
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState('');

    // Thêm cột STT vào đầu columns
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
                return fetcher(
                    typeof search === 'string' ? search : '',
                    typeof page === 'number' ? page : 1,
                    typeof limit === 'number' ? limit : 10
                );
            } else {
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    message: '',
                    data: [],
                    totalRecords: 0,
                    totalPages: 0,
                    currentPage: 1,
                    pageSize: typeof limit === 'number' ? limit : 10,
                    IMeta: {},
                } as IIndexResponse<T>);
            }
        },
        { revalidateOnFocus: false }
    );

    useEffect(() => {
        console.log('DataGrid useEffect', data);
    },);

    const handleSearch = (value: string) => {
        setSearchText(value);
        setPageIndex(1)
    };

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-2 mb-2">
                <div className="flex justify-end w-full">
                    <Searchbar setSearchText={handleSearch} />
                </div>
            </div>

            <Table<T>
                columns={columnsWithSTT}
                dataSource={data?.data || []}
                loading={isLoading}
                rowKey={rowKey as string}
                scroll={{ x: 'max-content' }}
                pagination={false}
                rowSelection={rowSelection}
                rowClassName={(record, index) =>
                    index % 2 === 0 ? 'dark:bg-[#1E2636] bg-gray-100' : 'dark:bg-[#242f45]'
                }
            />
            <Pagination
                className="flex flex-row mt-5 items-center sm:justify-end justify-between"
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
        </>
    );
};

export default DataGrid;
