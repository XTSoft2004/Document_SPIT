'use client'
import { getDepartment } from "@/actions/department.action";
import ModalCreateDepartment from "@/components/ui/Admin/Department/Modal/ModalCreateDepartment";
import ModalUpdateDepartment from "@/components/ui/Admin/Department/Modal/ModalUpdateDepartment";
import DataGrid from "@/components/ui/Table/DataGrid";
import { IDepartmentResponse } from "@/types/department";
import { reloadTable } from "@/utils/swrReload";
import { Button, TableColumnsType, Tooltip } from "antd";
import { Pen } from "lucide-react";
import { useState } from "react";

export default function DepartmentPage() {
    const [selectedDepartment, setSelectedDepartment] = useState<IDepartmentResponse>();
    const columns: TableColumnsType<IDepartmentResponse> = [
        {
            title: 'Mã phòng ban',
            dataIndex: 'code',
            key: 'code',
            width: 50,
            ellipsis: true,
            render: (code: string) => (
                <span className="max-w-32 truncate inline-block" title={code}>
                    {code}
                </span>
            ),
        },
        {
            title: 'Tên phòng ban',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (name: string) => (
                <span className="max-w-48 truncate inline-block" title={name}>
                    {name}
                </span>
            ),
        },
        {
            title: 'Thư mục liên kết',
            dataIndex: 'folderId',
            key: 'folderId',
            width: 150,
            render: (folderId: string) => (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-50 text-yellow-700 font-medium text-xs border border-yellow-200">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="inline mr-1 text-yellow-400">
                        <path d="M3 7a2 2 0 0 1 2-2h4.465a2 2 0 0 1 1.414.586l1.535 1.535A2 2 0 0 0 14.828 8H19a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    {folderId
                        ? (
                            <span className="max-w-24 truncate inline-block" title={folderId}>
                                {folderId}
                            </span>
                        )
                        : <span className="italic text-gray-400">Chưa có</span>
                    }
                </span>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Tooltip title="Chỉnh sửa">
                    <Button
                        type="text"
                        icon={<Pen />}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDepartment(record);
                            setIsShowModalUpdate(true);
                        }}
                    />
                </Tooltip>
            ),
        }
    ];
    const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
    const [isShowModalCreate, setIsShowModalCreate] = useState(false);

    return (
        <>
            <DataGrid<IDepartmentResponse>
                nameTable="department"
                columns={columns}
                rowKey="id"
                fetcher={async (search: string, page: number, limit: number) => {
                    const res = await getDepartment(search, page, limit);
                    return res;
                }}
                btnAddInfo={{
                    title: 'Thêm phòng ban',
                    onClick: () => {
                        setIsShowModalCreate(true);
                    },
                }}
                singleSelect={true}
            />

            <ModalCreateDepartment
                visible={isShowModalCreate}
                onCancel={() => {
                    setIsShowModalCreate(false)
                    reloadTable('department');
                }}
            />

            <ModalUpdateDepartment
                visible={isShowModalUpdate}
                department={selectedDepartment}
                onCancel={() => {
                    setIsShowModalUpdate(false);
                    reloadTable('department');
                }}
            />
        </>
    );
}