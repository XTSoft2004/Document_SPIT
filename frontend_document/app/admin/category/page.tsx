'use client'
import { getCategory } from "@/actions/category.actions";
import ModalCreateCategory from "@/components/ui/Admin/Category/Modal/ModalCreateCategory";
import ModalUpdateCategory from "@/components/ui/Admin/Category/Modal/ModalUpdateCategory";
import DataGrid from "@/components/ui/Table/DataGrid";
import { ICategoryResponse } from "@/types/category";
import { reloadTable } from "@/utils/swrReload";
import { Button, TableColumnsType, Tooltip, Tag } from "antd";
import { Pen, Hash, FolderOpen } from "lucide-react";
import { useState } from "react";

export default function CategoryPage() {
    const [selectedCategory, setSelectedCategory] = useState<ICategoryResponse>();
    const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
    const [isShowModalCreate, setIsShowModalCreate] = useState(false);

    const columns: TableColumnsType<ICategoryResponse> = [
        {
            title: (
                <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-green-500" />
                    <span>Tên danh mục</span>
                </div>
            ),
            dataIndex: 'name',
            key: 'name',
            width: 300,
            render: (name: string) => (
                <div className="flex items-center gap-2">
                    {/* <div className="w-2 h-2 bg-green-500 rounded-full"></div> */}
                    <span
                        className="max-w-64 truncate inline-block font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200"
                        title={name}
                    >
                        {name}
                    </span>
                </div>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: 250,
            render: (description: string) => (
                <span
                    className={`${description
                        ? 'text-gray-600 max-w-48 truncate inline-block'
                        : 'text-gray-400 italic'
                        }`}
                    title={description || 'Không có mô tả'}
                >
                    {description || 'Không có mô tả'}
                </span>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <div className="flex justify-center">
                    <Tooltip title="Chỉnh sửa danh mục">
                        <Button
                            type="text"
                            icon={<Pen className="w-4 h-4" />}
                            className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCategory(record);
                                setIsShowModalUpdate(true);
                            }}
                        />
                    </Tooltip>
                </div>
            ),
        }
    ];

    return (
        <>
            <DataGrid<ICategoryResponse>
                nameTable="category"
                columns={columns}
                rowKey="id"
                fetcher={getCategory}
                btnAddInfo={{
                    title: 'Thêm danh mục',
                    onClick: () => {
                        setIsShowModalCreate(true);
                    },
                }}
                singleSelect={true}
            />

            <ModalCreateCategory
                visible={isShowModalCreate}
                onCancel={() => {
                    setIsShowModalCreate(false);
                    reloadTable('category');
                }}
            />

            <ModalUpdateCategory
                visible={isShowModalUpdate}
                category={selectedCategory}
                onCancel={() => {
                    setIsShowModalUpdate(false);
                    setSelectedCategory(undefined);
                    reloadTable('category');
                }}
            />
        </>
    );
}