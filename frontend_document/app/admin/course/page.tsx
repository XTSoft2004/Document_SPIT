'use client'
import { getCourse } from "@/actions/course.action";
import { getDepartment } from "@/actions/department.action";
import ModalCreateCourse from "@/components/ui/Admin/Course/Modal/ModalCreateCourse";
import ModalUpdateCourse from "@/components/ui/Admin/Course/Modal/ModalUpdateCourse";
import DataGrid from "@/components/ui/Table/DataGrid";
import { ICourseResponse } from "@/types/course";
import { IDepartmentResponse } from "@/types/department";
import { reloadTable } from "@/utils/swrReload";
import { Button, TableColumnsType, Tooltip } from "antd";
import { Pen } from "lucide-react";
import { use, useEffect, useState } from "react";

export default function CoursePage() {
    const [selectedCourse, setSelectedCourse] = useState<ICourseResponse>();
    const [departments, setDepartments] = useState<IDepartmentResponse[]>([]);
    const fetchDepartments = async () => {
        const response = await getDepartment();
        if (response.ok) {
            setDepartments(response.data);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const columns: TableColumnsType<ICourseResponse> = [
        {
            title: 'Mã khóa học',
            dataIndex: 'code',
            key: 'code',
            width: 50,
            align: 'center',
        },
        {
            title: 'Tên khóa học',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (name: string) => (
                <span className="max-w-64 truncate inline-block" title={name}>
                    {name}
                </span>
            ),
        },
        {
            title: 'Khoa',
            dataIndex: 'departmentId',
            key: 'departmentId',
            width: 100,
            render: (departmentId: number) => {
                const department = departments.find(dept => dept.id === departmentId);
                const departmentName = department ? department.name : 'Không xác định';
                return (
                    <div className="flex items-center">
                        <span
                            className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200 max-w-50 truncate inline-block shadow-sm hover:shadow-md transition-shadow duration-200 whitespace-nowrap"
                            title={departmentName}
                        >
                            {departmentName}
                        </span>
                    </div>
                )
            },
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
                            <span className="max-w-30 truncate inline-block" title={folderId}>
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
                            setSelectedCourse(record);
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
            <DataGrid<ICourseResponse>
                nameTable="course"
                columns={columns}
                rowKey="id"
                fetcher={async (search: string, page: number, limit: number) => {
                    const res = await getCourse(search, page, limit);
                    return res;
                }}
                btnAddInfo={{
                    title: 'Thêm khóa học',
                    onClick: () => {
                        setIsShowModalCreate(true);
                    },
                }}
                singleSelect={true}
            />

            <ModalCreateCourse
                visible={isShowModalCreate}
                departments={departments}
                onCancel={() => {
                    setIsShowModalCreate(false)
                    reloadTable('course');
                }}
            />

            <ModalUpdateCourse
                departments={departments}
                visible={isShowModalUpdate}
                course={selectedCourse}
                onCancel={() => {
                    setIsShowModalUpdate(false);
                    reloadTable('course');
                }}
            />
        </>
    );
}