import { Fragment, useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import Icon from '../../components/Icon';
import NotificationDropdown from '../../components/NotificationDropdown';
import SettingsDropdown from '../../components/SettingsDropdown';
const menuItems = [
    { icon: 'dashboard', label: 'Tổng quan', href: ROUTES.HOME },
    { icon: 'manage_accounts', label: 'Quản lý tài khoản', href: ROUTES.ADMIN.USERS },
    { icon: 'security', label: 'Quyền truy cập', href: ROUTES.ADMIN.ROLES },
    { icon: 'settings', label: 'Cấu hình hệ thống', href: ROUTES.ADMIN.SYSTEM_CONFIG },
    { icon: 'history', label: 'Nhật ký hệ thống', href: ROUTES.ADMIN.AUDIT_LOG },
];
const DATE_FILTER_PRESETS = [
    { key: 'today', label: 'Hôm nay' },
    { key: 'yesterday', label: 'Hôm qua' },
    { key: '7days', label: '7 ngày gần nhất' },
    { key: '30days', label: '30 ngày gần nhất' },
    { key: 'single', label: 'Chọn 1 ngày bất kỳ' },
    { key: 'custom', label: 'Tùy chọn khoảng thời gian' },
];

const dashboardDataset = {
    '2024-05-24': {
        title: '24/05/2024',
        metrics: {
            totalSlots: '1,250',
            available: '184',
            revenue: '42.5M',
            turnover: '3,892',
            trends: {
                totalSlots: '+2.5%',
                available: '85% Đầy',
                revenue: '+12%',
                turnover: '-0.8%',
            },
        },
        chartBars: [35, 48, 62, 55, 90, 74, 52, 60],
        vehicleDistribution: { car: 62, motorbike: 25, electric: 13, total: '3.8K' },
        activityRows: [
            ['30F-123.45', '14:20', 'Vào', 'Tầng B1 - A05', 'Thành công', 'success'],
            ['51G-888.88', '14:18', 'Ra', 'Cổng Chính 1', 'Thành công', 'success'],
            ['29A-555.21', '14:15', 'Vào', 'Tầng B2 - C12', 'Chờ duyệt', 'warning'],
            ['43C-990.01', '14:12', 'Ra', 'Cổng Phụ 2', 'Lỗi thẻ', 'error'],
        ],
        devices: [
            ['videocam', 'Hệ thống Camera AI', '24/24 Online', 'online'],
            ['door_front', 'Cổng Barrier', '8/8 Hoạt động', 'online'],
            ['point_of_sale', 'Trạm thu phí POS', '1 trạm đang bảo trì', 'offline'],
            ['router', 'Hệ thống Mạng & Server', 'Độ trễ: 12ms', 'online'],
        ],
    },
    '2024-05-20': {
        title: '20/05/2024',
        metrics: {
            totalSlots: '1,160',
            available: '218',
            revenue: '38.7M',
            turnover: '3,510',
            trends: {
                totalSlots: '-1.1%',
                available: '78% Đầy',
                revenue: '+8%',
                turnover: '+3.1%',
            },
        },
        chartBars: [32, 43, 55, 49, 82, 67, 47, 56],
        vehicleDistribution: { car: 58, motorbike: 27, electric: 15, total: '3.6K' },
        activityRows: [
            ['26B-412.10', '13:55', 'Ra', 'Cổng Chính 1', 'Thành công', 'success'],
            ['74C-908.22', '13:42', 'Vào', 'Tầng B2 - D05', 'Thành công', 'success'],
            ['02A-334.78', '13:10', 'Vào', 'Tầng B1 - C02', 'Lỗi thẻ', 'error'],
            ['39D-221.45', '12:58', 'Ra', 'Cổng Phụ 1', 'Thành công', 'success'],
        ],
        devices: [
            ['videocam', 'Hệ thống Camera AI', '24/24 Online', 'online'],
            ['door_front', 'Cổng Barrier', '7/8 Hoạt động', 'warning'],
            ['point_of_sale', 'Trạm thu phí POS', '1 trạm đang bảo trì', 'offline'],
            ['router', 'Hệ thống Mạng & Server', 'Độ trễ: 14ms', 'online'],
        ],
    },
    '2024-05-15': {
        title: '15/05/2024',
        metrics: {
            totalSlots: '1,080',
            available: '196',
            revenue: '35.4M',
            turnover: '3,210',
            trends: {
                totalSlots: '-4.2%',
                available: '81% Đầy',
                revenue: '-5%',
                turnover: '+1.0%',
            },
        },
        chartBars: [28, 47, 52, 64, 79, 62, 39, 45],
        vehicleDistribution: { car: 55, motorbike: 30, electric: 15, total: '3.2K' },
        activityRows: [
            ['81F-332.90', '10:35', 'Vào', 'Tầng B1 - A12', 'Thành công', 'success'],
            ['70G-999.88', '10:12', 'Ra', 'Cổng Phụ 2', 'Lỗi thẻ', 'error'],
            ['10B-456.78', '09:42', 'Vào', 'Tầng B3 - B04', 'Chờ duyệt', 'warning'],
            ['32C-082.65', '09:10', 'Ra', 'Cổng Chính 1', 'Thành công', 'success'],
        ],
        devices: [
            ['videocam', 'Hệ thống Camera AI', '24/24 Online', 'online'],
            ['door_front', 'Cổng Barrier', '8/8 Hoạt động', 'online'],
            ['point_of_sale', 'Trạm thu phí POS', '2 trạm đang bảo trì', 'offline'],
            ['router', 'Hệ thống Mạng & Server', 'Độ trễ: 18ms', 'online'],
        ],
    },
    '2024-05-23': {
        title: '23/05/2024',
        metrics: {
            totalSlots: '1,220',
            available: '172',
            revenue: '40.8M',
            turnover: '3,745',
            trends: {
                totalSlots: '+1.3%',
                available: '83% Đầy',
                revenue: '+9%',
                turnover: '+0.4%',
            },
        },
        chartBars: [38, 50, 68, 53, 87, 70, 49, 58],
        vehicleDistribution: { car: 60, motorbike: 26, electric: 14, total: '3.7K' },
        activityRows: [
            ['44A-201.77', '16:14', 'Vào', 'Tầng B2 - C22', 'Thành công', 'success'],
            ['55K-712.33', '16:05', 'Ra', 'Cổng Phụ 1', 'Thành công', 'success'],
            ['15E-390.14', '15:42', 'Vào', 'Tầng B1 - D10', 'Thành công', 'success'],
            ['87N-604.91', '15:18', 'Ra', 'Cổng Chính 2', 'Chờ duyệt', 'warning'],
        ],
        devices: [
            ['videocam', 'Hệ thống Camera AI', '24/24 Online', 'online'],
            ['door_front', 'Cổng Barrier', '8/8 Hoạt động', 'online'],
            ['point_of_sale', 'Trạm thu phí POS', '1 trạm đang bảo trì', 'offline'],
            ['router', 'Hệ thống Mạng & Server', 'Độ trễ: 13ms', 'online'],
        ],
    },
};

function toDateKey(date) {
    return date.toISOString().slice(0, 10);
}

function formatDisplayDate(date) {
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function formatDateInput(date) {
    return date.toISOString().slice(0, 10);
}

function parseInputDate(value) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
}

const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

function isSameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInRange(day, start, end) {
    if (!day || !start || !end) return false;
    return day >= start && day <= end;
}

function getCalendarMatrix(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();
    const offset = (firstDay.getDay() + 6) % 7;
    const weeks = [];
    let week = Array.from({ length: offset }, () => null);

    for (let day = 1; day <= lastDay; day += 1) {
        week.push(day);
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    }

    if (week.length) {
        while (week.length < 7) {
            week.push(null);
        }
        weeks.push(week);
    }

    return weeks;
}

function monthLabel(year, month) {
    return new Date(year, month, 1).toLocaleDateString('vi-VN', {
        month: 'long',
        year: 'numeric',
    });
}

function buildFallbackData(dateKey) {
    const date = parseInputDate(dateKey);
    const day = date.getDate();
    const slots = 1080 + ((day * 3) % 190);
    const available = 140 + ((day * 5) % 130);
    const revenue = 30 + ((day * 0.7) % 15);
    const turnover = 3000 + ((day * 16) % 1300);
    const car = Math.min(68, 50 + (day % 19));
    const motorbike = Math.min(32, 24 + (day % 12));
    const electric = Math.max(10, 100 - car - motorbike);
    return {
        title: formatDisplayDate(date),
        metrics: {
            totalSlots: slots.toLocaleString('vi-VN'),
            available: available.toLocaleString('vi-VN'),
            revenue: `${revenue.toFixed(1)}M`,
            turnover: turnover.toLocaleString('vi-VN'),
            trends: {
                totalSlots: `${day % 2 === 0 ? '+' : '-'}${((day % 5) + 1).toFixed(1)}%`,
                available: `${Math.max(70, 78 + (day % 18))}% Đầy`,
                revenue: `${day % 2 === 0 ? '+' : '-'}${(4 + (day % 6)).toFixed(0)}%`,
                turnover: `${day % 2 === 0 ? '+' : '-'}${((day % 7) + 1).toFixed(1)}%`,
            },
        },
        chartBars: Array.from({ length: 8 }, (_, index) => 35 + ((day * 5 + index * 8) % 55)),
        vehicleDistribution: {
            car,
            motorbike,
            electric,
            total: `${(3.0 + (day % 8) * 0.1).toFixed(1)}K`,
        },
        activityRows: [
            ['XXF-000.00', '08:15', 'Vào', 'Cổng Chính 1', 'Thành công', 'success'],
            ['YYG-123.45', '09:02', 'Ra', 'Cổng Phụ 2', 'Thành công', 'success'],
            ['ZZH-567.89', '10:40', 'Vào', 'Tầng A1 - B03', 'Chờ duyệt', 'warning'],
            ['QWE-321.00', '11:24', 'Ra', 'Cổng Chính 3', 'Lỗi thẻ', 'error'],
        ],
        devices: [
            ['videocam', 'Hệ thống Camera AI', '24/24 Online', 'online'],
            ['door_front', 'Cổng Barrier', '7/8 Hoạt động', 'warning'],
            ['point_of_sale', 'Trạm thu phí POS', '1 trạm đang bảo trì', 'offline'],
            ['router', 'Hệ thống Mạng & Server', `Độ trễ: ${10 + (day % 15)}ms`, 'online'],
        ],
    };
}

function getSelectedDateKeys(filter, selectedDate, customStartDate, customEndDate) {
    const endDate = new Date(selectedDate);
    if (filter === 'yesterday') {
        const yesterday = new Date(selectedDate);
        yesterday.setDate(yesterday.getDate() - 1);
        return [toDateKey(yesterday)];
    }
    if (filter === '7days' || filter === '30days') {
        const days = filter === '7days' ? 7 : 30;
        const keys = [];
        const range = new Date(endDate);
        for (let offset = days - 1; offset >= 0; offset -= 1) {
            const current = new Date(endDate);
            current.setDate(endDate.getDate() - offset);
            keys.push(toDateKey(current));
        }
        return keys;
    }
    if (filter === 'custom') {
        const keys = [];
        const current = new Date(customStartDate);
        while (current <= customEndDate) {
            keys.push(toDateKey(current));
            current.setDate(current.getDate() + 1);
        }
        return keys;
    }
    return [toDateKey(selectedDate)];
}

function aggregateDashboardData(keys) {
    const entries = keys.map((key) => dashboardDataset[key] || buildFallbackData(key));
    const average = (values) => Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
    const totalSlots = average(entries.map((entry) => Number(entry.metrics.totalSlots.replace(/,/g, ''))));
    const available = average(entries.map((entry) => Number(entry.metrics.available.replace(/,/g, ''))));
    const revenueNumber = average(entries.map((entry) => Number(entry.metrics.revenue.replace(/M/, ''))));
    const turnover = average(entries.map((entry) => Number(entry.metrics.turnover.replace(/,/g, ''))));
    const carShare = average(entries.map((entry) => entry.vehicleDistribution.car));
    const motorbikeShare = average(entries.map((entry) => entry.vehicleDistribution.motorbike));
    const electricShare = Math.max(10, 100 - carShare - motorbikeShare);
    return {
        metrics: {
            totalSlots: totalSlots.toLocaleString('vi-VN'),
            available: available.toLocaleString('vi-VN'),
            revenue: `${revenueNumber.toFixed(1)}M`,
            turnover: turnover.toLocaleString('vi-VN'),
            trends: {
                totalSlots: entries[entries.length - 1].metrics.trends.totalSlots,
                available: entries[entries.length - 1].metrics.trends.available,
                revenue: entries[entries.length - 1].metrics.trends.revenue,
                turnover: entries[entries.length - 1].metrics.trends.turnover,
            },
        },
        chartBars: entries.slice(-8).map((entry) => entry.chartBars[0] || 40),
        vehicleDistribution: {
            car: carShare,
            motorbike: motorbikeShare,
            electric: electricShare,
            total: `${(3.2 + (entries.length % 8) * 0.1).toFixed(1)}K`,
        },
        activityRows: entries.flatMap((entry) => entry.activityRows).slice(0, 4),
        devices: entries[entries.length - 1].devices,
    };
}

function getDashboardData(filter, selectedDate, customStartDate, customEndDate) {
    const keys = getSelectedDateKeys(filter, selectedDate, customStartDate, customEndDate);
    const aggregate = aggregateDashboardData(keys);
    const label = filter === 'custom'
        ? `${formatDisplayDate(customStartDate)} – ${formatDisplayDate(customEndDate)}`
    : filter === '7days'
      ? '7 ngày gần nhất'
      : filter === '30days'
        ? '30 ngày gần nhất'
        : keys.length === 1
          ? dashboardDataset[keys[0]]?.title || formatDisplayDate(selectedDate)
          : `${keys.length}-ngày`;
    return { label, ...aggregate };
}
export default function HomePage() {
    const { user, role } = useAuth();
    const baseDate = new Date('2024-05-24');
    const today = new Date();
    const [reportPreviewOpen, setReportPreviewOpen] = useState(false);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [diagnosticOpen, setDiagnosticOpen] = useState(false);
    const [isDiagnosticLoading, setIsDiagnosticLoading] = useState(false);
    const [dateFilterOpen, setDateFilterOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('today');
    const [selectedDate, setSelectedDate] = useState(baseDate);
    const [customStartDate, setCustomStartDate] = useState(new Date('2024-05-18'));
    const [customEndDate, setCustomEndDate] = useState(baseDate);
    const [calendarMonth, setCalendarMonth] = useState(baseDate.getMonth());
    const [calendarYear, setCalendarYear] = useState(baseDate.getFullYear());
    const [rangeSelectionAnchor, setRangeSelectionAnchor] = useState(null);
    const [dashboardData, setDashboardData] = useState(() => getDashboardData('today', baseDate, customStartDate, baseDate));
    const [isLoadingData, setIsLoadingData] = useState(false);

    function setCalendarViewForDate(date) {
        setCalendarMonth(date.getMonth());
        setCalendarYear(date.getFullYear());
    }

    function toggleDateFilter() {
        const reference = selectedFilter === 'custom' ? customEndDate : selectedDate;
        setCalendarViewForDate(reference);
        setRangeSelectionAnchor(reference);
        setDateFilterOpen((value) => !value);
    }

    function changeCalendarMonth(direction) {
        setCalendarMonth((prevMonth) => {
            const next = prevMonth + direction;
            if (next < 0) {
                setCalendarYear((year) => year - 1);
                return 11;
            }
            if (next > 11) {
                setCalendarYear((year) => year + 1);
                return 0;
            }
            return next;
        });
    }

    function selectCalendarDate(day) {
        const clickedDate = new Date(calendarYear, calendarMonth, day);
        if (clickedDate > today) return;

        const sameSingleDay = isSameDay(customStartDate, customEndDate);
        const singleMode = selectedFilter === 'single';

        if (selectedFilter !== 'custom') {
            setCustomStartDate(clickedDate);
            setCustomEndDate(clickedDate);
            setRangeSelectionAnchor(clickedDate);
        } else if (sameSingleDay && !isSameDay(clickedDate, customStartDate)) {
            if (clickedDate < customStartDate) {
                setCustomStartDate(clickedDate);
            } else {
                setCustomEndDate(clickedDate);
            }
        } else {
            if (clickedDate < customStartDate) {
                setCustomStartDate(clickedDate);
            } else {
                setCustomEndDate(clickedDate);
            }
        }

        setSelectedDate(clickedDate);
        if (singleMode) {
            setCustomStartDate(clickedDate);
            setCustomEndDate(clickedDate);
        }
    }

    function applySelection() {
        if (selectedFilter === 'custom' && customStartDate > customEndDate) {
            setCustomEndDate(customStartDate);
        }
        setDateFilterOpen(false);
    }

    const dateFilterLabel = useMemo(() => {
        if (selectedFilter === 'today') return `Hôm nay: ${dashboardData.label}`;
        if (selectedFilter === 'yesterday') return `Hôm qua: ${dashboardData.label}`;
        if (selectedFilter === '7days') return '7 ngày gần nhất';
        if (selectedFilter === '30days') return '30 ngày gần nhất';
        if (selectedFilter === 'single') return `Ngày: ${formatDisplayDate(selectedDate)}`;
        return dashboardData.label;
    }, [selectedFilter, dashboardData.label, selectedDate]);

    const reportGeneratedAt = new Date().toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const reportInsights = useMemo(() => {
        const incidentCount = dashboardData.devices.filter(([, , subtitle, state]) => /bảo trì|bảo trì|offline|Lỗi/.test(subtitle) || state !== 'online').length;
        const successCount = dashboardData.activityRows.filter(([, , type, , status]) => status === 'Thành công').length;
        const successRate = dashboardData.activityRows.length ? `${Math.round(successCount / dashboardData.activityRows.length * 100)}%` : '0%';
        return {
            incidentCount,
            successRate,
            occupancy: dashboardData.metrics.trends.available,
            peakPeriod: '18:00 - 19:00',
            peakVolume: '432 xe',
        };
    }, [dashboardData]);

    const metricCards = useMemo(() => [
        {
            icon: 'directions_car',
            label: 'Tổng chỗ đỗ',
            value: dashboardData.metrics.totalSlots,
            trend: dashboardData.metrics.trends.totalSlots,
            tone: 'blue',
        },
        {
            icon: 'event_seat',
            label: 'Chỗ trống hiện tại',
            value: dashboardData.metrics.available,
            trend: dashboardData.metrics.trends.available,
            tone: 'slate',
        },
        {
            icon: 'payments',
            label: 'Doanh thu hôm nay',
            value: dashboardData.metrics.revenue,
            trend: dashboardData.metrics.trends.revenue,
            tone: 'orange',
            featured: true,
        },
        {
            icon: 'sync_alt',
            label: 'Lượt xe ra/vào',
            value: dashboardData.metrics.turnover,
            trend: dashboardData.metrics.trends.turnover,
            tone: 'gray',
            negative: dashboardData.metrics.trends.turnover.startsWith('-'),
        },
    ], [dashboardData]);

    useEffect(() => {
        setIsLoadingData(true);
        const timer = window.setTimeout(() => {
            setDashboardData(getDashboardData(selectedFilter, selectedDate, customStartDate, customEndDate));
            setIsLoadingData(false);
        }, 320);
        return () => window.clearTimeout(timer);
    }, [selectedFilter, selectedDate, customStartDate, customEndDate]);

    function applyDateFilter(key) {
        const today = new Date(baseDate);
        const yesterday = new Date(baseDate);
        yesterday.setDate(yesterday.getDate() - 1);

        if (key === 'today') {
            setSelectedDate(today);
            setSelectedFilter('today');
            setDateFilterOpen(false);
            return;
        }
        if (key === 'yesterday') {
            setSelectedDate(yesterday);
            setSelectedFilter('yesterday');
            setDateFilterOpen(false);
            return;
        }
        if (key === 'single') {
            setSelectedFilter('single');
            setSelectedDate(today);
            setCalendarViewForDate(today);
            setRangeSelectionAnchor(today);
            return;
        }
        setSelectedFilter(key);
        if (key !== 'custom') {
          setDateFilterOpen(false);
        }
    }

    function applyCustomRange() {
        if (customStartDate > customEndDate) {
            setCustomEndDate(customStartDate);
        }
        setSelectedFilter('custom');
        setDateFilterOpen(false);
    }

    function escapeCsvValue(value) {
      const stringValue = String(value ?? '');
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    function buildCsvContent(rows) {
      const headers = ['Thời gian', 'Hành động', 'Trạng thái', 'Nội dung'];
      return [headers, ...rows].map((row) => row.map(escapeCsvValue).join(',')).join('\n');
    }

    function downloadReport(content, fileName) {
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    function openReportPreview() {
      setReportPreviewOpen(true);
      setIsPreviewLoading(true);
      window.setTimeout(() => {
        setIsPreviewLoading(false);
      }, 400);
    }

    function closeReportPreview() {
      setReportPreviewOpen(false);
      setIsPreviewLoading(false);
    }

    function openSystemDiagnosis() {
      setDiagnosticOpen(true);
      setIsDiagnosticLoading(true);
      window.setTimeout(() => {
        setIsDiagnosticLoading(false);
      }, 500);
    }

    function closeDiagnosticDrawer() {
      setDiagnosticOpen(false);
      setIsDiagnosticLoading(false);
    }

    function confirmReportExport(format) {
      const rows = dashboardData.activityRows.map((activity) => [
        activity[1],
        activity[2],
        activity[4],
        activity[3],
      ]);
      const csvContent = buildCsvContent(rows);
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      downloadReport(csvContent, `smart-parking-report-${timestamp}.${format === 'Excel' ? 'csv' : 'pdf'}`);
      setReportPreviewOpen(false);
    }

    return (
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 bg-slate-900 text-white shadow-xl">
          <div className="space-y-6 p-4">
            {/* Brand */}
            <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-600">
                <Icon name="local_parking" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Smart Parking AI</h1>
                <p className="text-xs text-slate-400">Hệ thống quản trị</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.href}
                  end={item.href === ROUTES.HOME}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    }`
                  }
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Footer */}
            <div className="space-y-1 border-t border-slate-700 pt-4">
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800/50 hover:text-white"
              >
                <Icon name="help" />
                <span>Hỗ trợ</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-300 transition hover:bg-slate-800/50 hover:text-rose-100"
              >
                <Icon name="logout" />
                <span>Đăng xuất</span>
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              {/* Search */}
              <label className="flex flex-1 items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-600 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-200">
                <Icon name="search" />
                <input
                  placeholder="Tìm kiếm dữ liệu, biển số xe..."
                  type="search"
                  className="flex-1 bg-transparent outline-none"
                />
              </label>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <NotificationDropdown />
                <SettingsDropdown
                  trigger={
                    <button className="flex items-center gap-2 rounded-lg hover:bg-gray-100 p-2 transition">
                      <span className="text-right">
                        <strong className="block text-sm text-gray-900">{user.fullName}</strong>
                        <small className="text-xs text-gray-600">
                          {role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                        </small>
                      </span>
                      <img
                        alt="User profile"
                        src={
                          user.avatarUrl ??
                          'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=96&q=80'
                        }
                        className="h-10 w-10 rounded-full"
                      />
                    </button>
                  }
                />
              </div>
            </div>
          </header>

          {/* Content Area */}
          <section className="space-y-6 p-6">
            {/* Page Heading */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Tổng quan hệ thống</h2>
                <p className="text-gray-600">Hiển thị toàn bộ dữ liệu dashboard theo bộ lọc ngày đã chọn.</p>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <span className="font-medium text-gray-700">{dateFilterLabel}</span>
                  {isLoadingData ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                      Đang tải dữ liệu mới...
                    </span>
                  ) : (
                    <span className="text-gray-600">Đã cập nhật theo ngày chọn.</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 lg:flex-row">
                {/* Date Filter */}
                <div className="relative">
                  <button
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
                    type="button"
                    onClick={toggleDateFilter}
                  >
                    <Icon name="calendar_today" />
                    <span>{dateFilterLabel}</span>
                    <Icon name={dateFilterOpen ? 'expand_less' : 'expand_more'} />
                  </button>

                  {dateFilterOpen && (
                    <div className="absolute right-0 top-full z-40 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-xl">
                      {/* Date Presets */}
                      <div className="grid grid-cols-2 gap-2 border-b border-gray-200 p-3">
                        {DATE_FILTER_PRESETS.map((preset) => (
                          <button
                            key={preset.key}
                            type="button"
                            className={`rounded px-3 py-2 text-sm font-medium transition ${
                              selectedFilter === preset.key
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => applyDateFilter(preset.key)}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                      {/* Calendar */}
                      {(selectedFilter === 'custom' || selectedFilter === 'single') && (
                        <div className="space-y-4 p-4">
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              className="rounded p-1 hover:bg-gray-100"
                              onClick={() => changeCalendarMonth(-1)}
                            >
                              <Icon name="chevron_left" />
                            </button>
                            <strong className="text-sm">
                              {monthLabel(calendarYear, calendarMonth)}
                            </strong>
                            <button
                              type="button"
                              className="rounded p-1 hover:bg-gray-100"
                              onClick={() => changeCalendarMonth(1)}
                            >
                              <Icon name="chevron_right" />
                            </button>
                          </div>

                          {/* Calendar Grid */}
                          <div className="grid grid-cols-7 gap-1">
                            {WEEK_DAYS.map((day) => (
                              <span key={day} className="text-center text-xs font-semibold text-gray-600">
                                {day}
                              </span>
                            ))}
                            {getCalendarMatrix(calendarYear, calendarMonth).map((week, weekIndex) => (
                              <Fragment key={weekIndex}>
                                {week.map((day, dayIndex) => {
                                  if (!day) {
                                    return (
                                      <span
                                        key={`${weekIndex}-${dayIndex}`}
                                        className="text-center text-xs text-gray-400"
                                      />
                                    );
                                  }
                                  const current = new Date(calendarYear, calendarMonth, day);
                                  const disabled = current > today;
                                  const isSelected =
                                    selectedFilter === 'custom'
                                      ? isSameDay(current, customStartDate) || isSameDay(current, customEndDate)
                                      : isSameDay(current, selectedDate);
                                  const inRange =
                                    selectedFilter === 'custom' &&
                                    isInRange(current, customStartDate, customEndDate);
                                  return (
                                    <button
                                      key={`${weekIndex}-${dayIndex}`}
                                      type="button"
                                      className={`rounded text-xs font-medium py-1 transition ${
                                        disabled
                                          ? 'text-gray-300 cursor-not-allowed'
                                          : isSelected
                                            ? 'bg-blue-600 text-white'
                                            : inRange
                                              ? 'bg-blue-100 text-blue-900'
                                              : 'hover:bg-gray-100 text-gray-700'
                                      }`}
                                      onClick={() => !disabled && selectCalendarDate(day)}
                                      disabled={disabled}
                                    >
                                      {day}
                                    </button>
                                  );
                                })}
                              </Fragment>
                            ))}
                          </div>

                          {/* Custom Range Inputs */}
                          {selectedFilter === 'custom' && (
                            <div className="flex gap-2">
                              <label className="flex-1 text-xs">
                                <span className="block font-medium text-gray-700 mb-1">Từ</span>
                                <input
                                  type="date"
                                  value={formatDateInput(customStartDate)}
                                  max={formatDateInput(customEndDate)}
                                  onChange={(event) => setCustomStartDate(parseInputDate(event.target.value))}
                                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                                />
                              </label>
                              <label className="flex-1 text-xs">
                                <span className="block font-medium text-gray-700 mb-1">Đến</span>
                                <input
                                  type="date"
                                  value={formatDateInput(customEndDate)}
                                  min={formatDateInput(customStartDate)}
                                  onChange={(event) => setCustomEndDate(parseInputDate(event.target.value))}
                                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                                />
                              </label>
                            </div>
                          )}

                          {/* Calendar Footer */}
                          <div className="flex items-center justify-between gap-2 border-t border-gray-200 pt-3">
                            <span className="text-xs text-gray-600">
                              {selectedFilter === 'custom'
                                ? `Từ ${formatDisplayDate(customStartDate)} đến ${formatDisplayDate(
                                    customEndDate,
                                  )}`
                                : `Chọn ngày: ${formatDisplayDate(selectedDate)}`}
                            </span>
                            <button
                              className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-blue-700"
                              type="button"
                              onClick={applySelection}
                            >
                              Áp dụng
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Export Report Button */}
                <button
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
                  type="button"
                  onClick={openReportPreview}
                >
                  <Icon name="download" />
                  Xuất báo cáo
                </button>
              </div>
            </div>

            {/* Metric Cards */}
            <section className="grid gap-4 lg:grid-cols-4">
              {metricCards.map((metric) => (
                <div
                  key={metric.label}
                  className={`rounded-lg border p-6 ${
                    metric.featured
                      ? 'border-blue-200 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                        metric.tone === 'blue'
                          ? 'bg-blue-100 text-blue-600'
                          : metric.tone === 'orange'
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Icon name={metric.icon} />
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        metric.negative ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {metric.trend}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <strong className="text-2xl font-bold text-gray-900">{metric.value}</strong>
                </div>
              ))}
            </section>

            {/* Analytics Grid */}
            <section className="grid gap-6 lg:grid-cols-2">
              {/* Traffic Chart */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    Lưu lượng xe 24h qua
                    <Icon name="auto_awesome" />
                  </h3>
                  <select className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm">
                    <option>Tất cả bãi xe</option>
                    <option>Bãi xe A1</option>
                    <option>Bãi xe B2</option>
                  </select>
                </div>
                <div className="mb-4 flex items-end justify-around gap-2 h-48">
                  {dashboardData.chartBars.map((height, index) => (
                    <div
                      key={`${height}-${index}`}
                      className="flex-1 rounded-t bg-blue-600 hover:bg-blue-700 transition"
                      style={{ height: `${height * 2}px` }}
                      title={`${height}%`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>00:00</span>
                  <span>04:00</span>
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                  <span>23:59</span>
                </div>
              </div>

              {/* Vehicle Distribution */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-6 text-lg font-bold">Phân loại phương tiện</h3>
                <div className="flex flex-col items-center gap-6">
                  <div className="text-center">
                    <div className="mb-2 text-3xl font-bold text-gray-900">
                      {dashboardData.vehicleDistribution.total}
                    </div>
                    <p className="text-sm text-gray-600">Tổng xe</p>
                  </div>
                  <div className="grid grid-cols-3 gap-6 w-full">
                    {[
                      { color: 'bg-blue-600', label: 'Ô tô', value: dashboardData.vehicleDistribution.car },
                      { color: 'bg-orange-500', label: 'Xe máy', value: dashboardData.vehicleDistribution.motorbike },
                      { color: 'bg-green-500', label: 'Xe điện', value: dashboardData.vehicleDistribution.electric },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <div className={`${item.color} h-2 rounded-full mb-2`} />
                        <p className="text-xs text-gray-600">{item.label}</p>
                        <strong className="text-lg font-bold text-gray-900">{item.value}%</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Activity & Devices Grid */}
            <section className="grid gap-6 lg:grid-cols-2">
              {/* Recent Activity */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Hoạt động gần đây</h3>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Xem tất cả</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Biển số xe</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Thời gian</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Loại</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Vị trí bãi</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.activityRows.map(([plate, time, type, place, status, state]) => (
                        <tr key={`${plate}-${time}`} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{plate}</td>
                          <td className="px-4 py-3 text-gray-600">{time}</td>
                          <td className="px-4 py-3 text-gray-600">{type}</td>
                          <td className="px-4 py-3 text-gray-600">{place}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                state === 'success'
                                  ? 'bg-green-100 text-green-800'
                                  : state === 'warning'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Device Status */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold">Trạng thái thiết bị</h3>
                <div className="space-y-3">
                  {dashboardData.devices.map(([icon, title, subtitle, state]) => (
                    <div key={title} className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-gray-700">
                          <Icon name={icon} />
                        </div>
                        <div>
                          <strong className="block text-gray-900">{title}</strong>
                          <p className={`text-sm ${state === 'offline' ? 'text-red-600' : 'text-gray-600'}`}>
                            {subtitle}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`h-3 w-3 rounded-full ${
                          state === 'online'
                            ? 'bg-green-500'
                            : state === 'warning'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                      />
                    </div>
                  ))}
                </div>
                <button
                  className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
                  type="button"
                  onClick={openSystemDiagnosis}
                >
                  Chẩn đoán hệ thống
                </button>
              </div>
            </section>
          </section>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white px-6 py-4 text-center text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <a href="#" className="hover:text-gray-900">
                  Điều khoản
                </a>
                <a href="#" className="hover:text-gray-900">
                  Bảo mật
                </a>
              </div>
              <span>Trạng thái hệ thống: Hoạt động</span>
            </div>
          </footer>
        </main>
      </div>
    );
}
