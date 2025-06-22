'use client';
import { getUsers } from "@/actions/user.action";
import DataGrid from "@/components/ui/Table/DataGrid";
import { IUserResponse } from "@/types/user";
import { TableColumnType } from "antd";

export default function UserPage() {
    const columns: TableColumnType<IUserResponse>[] = [
        // {
        //     title: 'ID',
        //     dataIndex: 'id',
        //     key: 'id',
        //     width: 100,
        // },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: 200,
        },
        {
            title: 'Full Name',
            dataIndex: 'fullname',
            key: 'fullname',
            width: 200,
            render: (text: string | undefined) => text && text.trim() !== '' ? text : 'Không có tên',
        },
        {
            title: 'Role',
            dataIndex: 'roleName',
            key: 'roleName',
            width: 150,
            render: (roleName: string | undefined) => roleName && roleName.trim() !== '' ? roleName : 'Chưa phân quyền',
        },
        {
            title: 'Locked',
            dataIndex: 'islocked',
            key: 'islocked',
            width: 100,
            render: (islocked: boolean) => islocked ? 'Khoá tài khoản' : 'Chưa khoá',
        },
    ];
    return (
        <DataGrid<IUserResponse>
            nameTable="products"
            columns={columns}
            rowKey="id"
            fetcher={async (search: string, page: number, limit: number) => {
                const res = await getUsers(search, page, limit);
                return res;
            }}
        />
    );

}