const deviceList = [
  { name: 'Camera Bãi A1', status: 'Hoạt động', tone: 'bg-emerald-500' },
  { name: 'Cổng ra vào B2', status: 'Offline', tone: 'bg-rose-500' },
  { name: 'Cảm biến trống B3', status: 'Hoạt động', tone: 'bg-emerald-500' },
  { name: 'Màn hình hướng dẫn', status: 'Bảo trì', tone: 'bg-amber-500' },
];

export default function DeviceStatus() {
  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-slate-200 ring-opacity-70">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Thiết bị</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">Tình trạng thiết bị</h3>
        </div>
        <span className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-600">4 thiết bị</span>
      </div>

      <div className="space-y-4">
        {deviceList.map((device) => (
          <div key={device.name} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="flex items-center gap-3">
              <span className={`inline-flex h-3.5 w-3.5 rounded-full ${device.tone}`}></span>
              <div>
                <p className="font-semibold text-slate-950">{device.name}</p>
                <p className="text-sm text-slate-500">{device.status}</p>
              </div>
            </div>
            <button className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800" type="button">
              Chi tiết
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
