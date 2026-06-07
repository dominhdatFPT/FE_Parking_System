import React, { useState } from 'react';

// Dữ liệu mẫu giả lập danh sách người dùng (Mock Data)
const mockUsers = [
    { id: 'NV001', name: 'Nguyễn Văn A', email: 'nva@nexus.com', role: 'Admin', status: 'active' },
    { id: 'NV002', name: 'Trần Thị B', email: 'ttb@nexus.com', role: 'Quản lý', status: 'active' },
    { id: 'NV003', name: 'Lê Văn C', email: 'lvc@nexus.com', role: 'Bảo vệ', status: 'inactive' },
    { id: 'NV004', name: 'Phạm Văn D', email: 'pvd@nexus.com', role: 'Bảo vệ', status: 'active' },
];

export default function AccountManagementPage() {
    // State quản lý giá trị của ô tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');

    // Tự động lọc danh sách người dùng khi gõ vào ô tìm kiếm
    const filteredUsers = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f7f9fb] px-8 py-6 text-[#191c1e] max-sm:px-4">
            <div className="mb-6">
                <h1 className="mb-2 text-[28px] font-bold text-black">Quản lý tài khoản</h1>
                <p className="text-[15px] text-[#45464d]">Hệ thống phân quyền và danh sách nhân sự Parking System</p>
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="relative w-full max-w-[400px]">
                    <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-[#76777d]">
                        search
                    </span>
                    <input
                        className="w-full rounded-lg border border-[#c6c6cd] bg-white py-2.5 pr-4 pl-11 text-sm outline-none transition focus:border-[#0051d5] focus:shadow-[0_0_0_1px_#0051d5]"
                        type="text"
                        placeholder="Tìm kiếm theo tên, mã NV, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#0051d5] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003ea8]">
                    <span className="material-symbols-outlined">person_add</span>
                    Thêm tài khoản mới
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#c6c6cd] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]">
                <table className="w-full border-collapse text-left">
                    <thead>
                    <tr>
                        <th className="border-b border-[#e0e3e5] bg-[#f2f4f6] p-4 text-[13px] font-bold uppercase tracking-[0.05em] text-[#45464d]">Nhân sự</th>
                        <th className="border-b border-[#e0e3e5] bg-[#f2f4f6] p-4 text-[13px] font-bold uppercase tracking-[0.05em] text-[#45464d]">Mã NV</th>
                        <th className="border-b border-[#e0e3e5] bg-[#f2f4f6] p-4 text-[13px] font-bold uppercase tracking-[0.05em] text-[#45464d]">Vai trò</th>
                        <th className="border-b border-[#e0e3e5] bg-[#f2f4f6] p-4 text-[13px] font-bold uppercase tracking-[0.05em] text-[#45464d]">Trạng thái</th>
                        <th className="border-b border-[#e0e3e5] bg-[#f2f4f6] p-4 text-[13px] font-bold uppercase tracking-[0.05em] text-[#45464d]">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <tr className="hover:bg-[#f7f9fb]" key={user.id}>
                                <td className="border-b border-[#e0e3e5] p-4 last:border-b-0">
                                    <div className="flex items-center gap-3">
                                        {/* Lấy chữ cái đầu của tên làm Avatar */}
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dae2fd] text-base font-bold text-[#0051d5]">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <strong className="block text-sm text-[#191c1e]">{user.name}</strong>
                                            <span className="text-[13px] text-[#76777d]">{user.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="border-b border-[#e0e3e5] p-4">{user.id}</td>
                                <td className="border-b border-[#e0e3e5] p-4">{user.role}</td>
                                <td className="border-b border-[#e0e3e5] p-4">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${user.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                                </td>
                                <td className="border-b border-[#e0e3e5] p-4">
                                    <div className="flex gap-2">
                                        <button className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-[#76777d] transition hover:bg-[#eceef0] hover:text-[#191c1e]" title="Chỉnh sửa">
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                        <button className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-[#76777d] transition hover:bg-red-100 hover:text-[#ba1a1a]" title="Xóa tài khoản">
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="p-8 text-center text-[#76777d]" colSpan="5">
                                Không tìm thấy tài khoản nào phù hợp.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
