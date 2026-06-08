import { useEffect, useMemo, useRef, useState } from 'react';

const formatShortDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const buildRangeText = (key, customFrom, customTo) => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (key === 'today') {
    return `Hôm nay: ${formatShortDate(now)}`;
  }

  if (key === 'yesterday') {
    return `Hôm qua: ${formatShortDate(yesterday)}`;
  }

  if (key === 'past7') {
    const from = new Date(now);
    from.setDate(now.getDate() - 6);
    return `7 ngày qua: ${formatShortDate(from)} - ${formatShortDate(now)}`;
  }

  if (key === 'past30') {
    const from = new Date(now);
    from.setDate(now.getDate() - 29);
    return `30 ngày qua: ${formatShortDate(from)} - ${formatShortDate(now)}`;
  }

  if (key === 'custom' && customFrom && customTo) {
    return `Tùy chọn: ${formatShortDate(new Date(customFrom))} - ${formatShortDate(new Date(customTo))}`;
  }

  return 'Tùy chọn ngày';
};

const rangeOptions = [
  { key: 'today', label: 'Hôm nay' },
  { key: 'yesterday', label: 'Hôm qua' },
  { key: 'past7', label: '7 ngày qua' },
  { key: 'past30', label: '30 ngày qua' },
  { key: 'custom', label: 'Tùy chọn ngày' },
];

const exportOptions = [
  { key: 'pdf', label: 'Xuất PDF' },
  { key: 'excel', label: 'Xuất Excel' },
  { key: 'csv', label: 'Xuất CSV' },
];

const reportTypes = [
  { value: 'summary', label: 'Báo cáo tổng quan' },
  { value: 'revenue', label: 'Báo cáo doanh thu' },
  { value: 'activity', label: 'Báo cáo hoạt động' },
];

export default function ReportToolbar() {
  const [activeRange, setActiveRange] = useState('today');
  const [customFrom, setCustomFrom] = useState('2024-05-24');
  const [customTo, setCustomTo] = useState('2024-05-30');
  const [reportType, setReportType] = useState(reportTypes[0].value);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastText, setToastText] = useState('');

  const toolbarRef = useRef(null);
  const exportMenuRef = useRef(null);

  const currentLabel = useMemo(
    () => buildRangeText(activeRange, customFrom, customTo),
    [activeRange, customFrom, customTo]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        setDateDropdownOpen(false);
        setExportDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!toastVisible) return;

    const timeout = window.setTimeout(() => {
      setToastVisible(false);
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [toastVisible]);

  const handleRangeSelect = (key) => {
    if (key === 'custom') {
      setDateDropdownOpen(false);
      setCustomModalOpen(true);
      return;
    }

    setActiveRange(key);
    setDateDropdownOpen(false);
  };

  const handleExportSelect = (option) => {
    setExportDropdownOpen(false);
    setToastText('Đang xuất báo cáo...');
    setToastVisible(true);

    // Mô phỏng xuất báo cáo.
    window.setTimeout(() => {
      setToastVisible(false);
    }, 1800);
  };

  const handleApplyCustom = () => {
    if (!customFrom || !customTo) {
      return;
    }

    setActiveRange('custom');
    setCustomModalOpen(false);
    setDateDropdownOpen(false);
  };

  return (
    <div ref={toolbarRef} className="relative flex flex-wrap items-center gap-3">
      <div className="relative">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
          onClick={() => {
            setDateDropdownOpen((prev) => !prev);
            setExportDropdownOpen(false);
          }}
        >
          <span className="material-symbols-outlined text-base">calendar_month</span>
          <span>{currentLabel}</span>
          <span className="material-symbols-outlined text-base">expand_more</span>
        </button>

        {dateDropdownOpen && (
          <div className="absolute right-0 z-20 mt-3 w-52 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 ring-opacity-80 transition-all duration-150 ease-out">
            <div className="space-y-1 p-2">
              {rangeOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => handleRangeSelect(option.key)}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${activeRange === option.key ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-[#1e3a8a] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
          onClick={() => {
            setExportDropdownOpen((prev) => !prev);
            setDateDropdownOpen(false);
          }}
        >
          <span className="material-symbols-outlined text-base">download</span>
          Xuất báo cáo
        </button>

        {exportDropdownOpen && (
          <div className="absolute right-0 z-20 mt-3 w-44 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 ring-opacity-80 transition-all duration-150 ease-out">
            <div className="space-y-1 p-2">
              {exportOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => handleExportSelect(option.key)}
                  className="w-full rounded-2xl px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {customModalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/40 px-4 py-6">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-950">Chọn khoảng thời gian</h3>
                <p className="mt-1 text-sm text-slate-500">Điền khoảng ngày và loại báo cáo cần xuất.</p>
              </div>
              <button
                type="button"
                onClick={() => setCustomModalOpen(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Từ ngày</label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(event) => setCustomFrom(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Đến ngày</label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(event) => setCustomTo(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Loại báo cáo</label>
                <select
                  value={reportType}
                  onChange={(event) => setReportType(event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  {reportTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setCustomModalOpen(false)}
                className="rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleApplyCustom}
                className="rounded-3xl bg-[#1e3a8a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}

      {toastVisible && (
        <div className="pointer-events-none fixed bottom-6 right-6 z-40 rounded-3xl border border-slate-200 bg-slate-950/95 px-5 py-4 text-sm text-white shadow-2xl backdrop-blur-sm">
          {toastText}
        </div>
      )}
    </div>
  );
}
