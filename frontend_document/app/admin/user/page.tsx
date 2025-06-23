'use client';
import { banAccountId, getUsers, setRoleUser } from "@/actions/user.action";
import ModalCreateUser from "@/components/ui/Admin/User/ModalCreateUser";
import ModalUpdateUser from "@/components/ui/Admin/User/ModalUpdateUser";
import ComboboxCustom from "@/components/ui/headless-ui/combobox";
import NotificationService from "@/components/ui/Notification/NotificationService";
import DataGrid from "@/components/ui/Table/DataGrid";
import Searchbar from "@/components/ui/Table/Searchbar";
import { IUserResponse } from "@/types/user";
import { Button, TableColumnType } from "antd";
import { Lock, LockOpen, Pen } from "lucide-react";
import { useState } from "react";
import { mutate } from "swr";

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
                        const setRole = await setRoleUser(record.id, newRole);
                        if (setRole.ok) {
                            mutate(['user', '', 1, 10]);
                            NotificationService.success({
                                message: `Cập nhật vai trò ${newRole} thành công cho người dùng ${record.fullname}`,
                            });
                            return;
                        }
                        NotificationService.error({
                            message: setRole.message,
                        });
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
        },
        {
            title: 'Locked',
            dataIndex: 'isLocked',
            key: 'isLocked',
            width: 150,
            render: (islocked: boolean) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
                                        ${islocked
                            ? "bg-red-100 text-red-600 border border-red-300"
                            : "bg-green-100 text-green-600 border border-green-300"
                        }`}
                >
                    {islocked ? 'Khoá tài khoản' : 'Chưa khoá'}
                </span>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_: any, record: IUserResponse) => (
                <span className="flex gap-2">
                    <Button
                        type="text"
                        icon={<Pen style={{ color: "#2563eb" }} />}
                        onClick={() => {
                            setSelectedUser(record);
                            setIsShowModalUpdate(true);
                        }}
                        title="Chỉnh sửa"
                    />
                    <Button
                        type="text"
                        icon={
                            record.islocked ? (
                                <LockOpen style={{ color: "#16a34a" }} />
                            ) : (
                                <Lock style={{ color: "#dc2626" }} />
                            )
                        }
                        onClick={async () => {
                            setSelectedUser(record);
                            const banAccount = await banAccountId(record.id);
                            if (banAccount.ok) {
                                NotificationService.success({
                                    message: `Tài khoản ${record.fullname} đã ${record.islocked ? 'mở khoá' : 'khoá'} thành công`,
                                });
                                mutate(['user', '', 1, 10]);
                                return;
                            }
                            NotificationService.error({
                                message: banAccount.message,
                            });
                        }}
                        title={record.islocked ? "Mở khoá tài khoản" : "Khoá tài khoản"}
                    />
                </span>
            ),
        }
    ];

    const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
    const [isShowModalCreate, setIsShowModalCreate] = useState(false);
    const handleSearch = (value: string) => {

    };
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
            />

            <ModalUpdateUser
                visible={isShowModalUpdate}
                user={selectedUser}
                onCancel={() => {
                    setIsShowModalUpdate(false);
                    mutate(['user', '', 1, 10]);
                }}
            />

            <ModalCreateUser
                visible={isShowModalCreate}
                onCancel={() => {
                    setIsShowModalCreate(false);
                    mutate(['user', '', 1, 10]);
                }}
            />
        </>
    );

}