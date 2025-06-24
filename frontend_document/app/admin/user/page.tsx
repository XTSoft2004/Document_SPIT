'use client';
import { banAccountId, getUsers, setRoleUser } from "@/actions/user.action";
import ModalCreateUser from "@/components/ui/Admin/User/ModalCreateUser";
import ModalUpdateUser from "@/components/ui/Admin/User/ModalUpdateUser";
import ComboboxCustom from "@/components/ui/headless-ui/combobox";
import NotificationService from "@/components/ui/Notification/NotificationService";
import DataGrid from "@/components/ui/Table/DataGrid";
import Searchbar from "@/components/ui/Table/Searchbar";
import { IUserResponse } from "@/types/user";
import { mutateTable, reloadTable } from "@/utils/swrReload";
import { Button, TableColumnType } from "antd";
import { Lock, LockOpen, Pen } from "lucide-react";
import { useState } from "react";

export default function UserPage() {
    const [selectedUser, setSelectedUser] = useState<IUserResponse>();

    const columns: TableColumnType<IUserResponse>[] = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: 100,
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
            render: (roleName: string | undefined, record: IUserResponse) => (
                <select
                    value={roleName || "User"}
                    onChange={async (e) => {
                        const newRole = e.target.value;
                        const setRole = await setRoleUser(record.id, newRole); if (setRole.ok) {
                            reloadTable('user');
                            NotificationService.success({
                                message: `Cập nhật vai trò ${newRole} thành công cho người dùng ${record.fullname}`,
                            });
                            return;
                        }
                        NotificationService.error({
                            message: setRole.message,
                        });
                        reloadTable('user');
                    }}
                    className={`px-3 py-1 rounded-full border 
                            ${roleName === "Admin"
                            ? "border-[#f87171] bg-[#fee2e2] text-[#ef4444] font-semibold"
                            : "border-[#38bdf8] bg-[#e0f2fe] text-[#0ea5e9] font-medium"} 
                            text-sm min-w-[70px] text-center outline-none appearance-none`}
                >
                    <option value="Admin" className="text-[#f87171] font-semibold text-left">
                        🛡️ Quản trị viên
                    </option>
                    <option value="User" className="text-[#38bdf8] font-medium text-left">
                        👤 Người dùng
                    </option>
                </select>
            ),
        }, {
            title: 'Locked',
            dataIndex: 'isLocked',
            key: 'isLocked',
            width: 150,
            render: (islocked: boolean, record: IUserResponse) => (
                <select
                    value={islocked ? "locked" : "unlocked"}
                    onChange={async (e) => {
                        const banAccount = await banAccountId(record.id); if (banAccount.ok) {
                            NotificationService.success({
                                message: `Tài khoản ${record.fullname} đã ${islocked ? 'mở khoá' : 'khoá'} thành công`,
                            });
                            reloadTable('user');
                            return;
                        }
                        NotificationService.error({
                            message: banAccount.message,
                        });
                        reloadTable('user');
                    }}
                    className={`px-3 py-1 rounded-full border 
                            ${islocked
                            ? "border-[#ef4444] bg-[#fef2f2] text-[#dc2626] font-semibold"
                            : "border-[#22c55e] bg-[#f0fdf4] text-[#16a34a] font-medium"} 
                            text-sm min-w-[100px] text-center outline-none appearance-none cursor-pointer`}
                >
                    <option value="unlocked" className="text-[#16a34a] font-medium text-left">
                        🔓 Hoạt động
                    </option>
                    <option value="locked" className="text-[#dc2626] font-semibold text-left">
                        🔒 Bị khoá
                    </option>
                </select>
            ),
        }, {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_: any, record: IUserResponse) => (
                <Button
                    type="text"
                    icon={<Pen style={{ color: "#2563eb" }} />}
                    onClick={() => {
                        setSelectedUser(record);
                        setIsShowModalUpdate(true);
                    }}
                    title="Chỉnh sửa"
                />
            ),
        }
    ];

    const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
    const [isShowModalCreate, setIsShowModalCreate] = useState(false);
    return (
        <>
            <DataGrid<IUserResponse>
                nameTable="user"
                columns={columns}
                rowKey="id"
                fetcher={async (search: string, page: number, limit: number) => {
                    const res = await getUsers(search, page, limit);
                    return res;
                }}
                btnAddInfo={{
                    title: 'Thêm người dùng',
                    onClick: () => {
                        setIsShowModalCreate(true);
                    },
                }}
                singleSelect={true}
            />            <ModalUpdateUser
                visible={isShowModalUpdate}
                user={selectedUser}
                onCancel={() => {
                    setIsShowModalUpdate(false);
                    reloadTable('user');
                }}
            />

            <ModalCreateUser
                visible={isShowModalCreate}
                onCancel={() => {
                    setIsShowModalCreate(false);
                    reloadTable('user');
                }}
            />
        </>
    );

}