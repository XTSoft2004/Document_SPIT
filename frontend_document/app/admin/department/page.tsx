'use client'
import { getDepartment } from "@/actions/department.action";
import RenderFolderLink from "@/components/common/RenderFolderLink";
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
            render: (_: string, record: IDepartmentResponse) => (
                <RenderFolderLink folderId={record.folderId} name={record.name} />
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