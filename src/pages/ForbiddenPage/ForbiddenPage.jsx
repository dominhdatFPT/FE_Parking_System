import { ShieldX } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a] p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
          <ShieldX size={40} className="text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">403 — Truy cập bị từ chối</h1>
        <p className="text-zinc-400 text-base leading-relaxed mb-8">
          Chỉ Admin mới có quyền sử dụng chức năng này.
        </p>
        <a
          href="/admin"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#4ade80] hover:bg-[#34c76d] text-zinc-950 font-bold rounded-xl text-sm transition"
        >
          Quay về trang chủ
        </a>
      </div>
    </div>
  );
}
