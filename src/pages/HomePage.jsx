import './HomePage.css';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';
import Icon from '../components/Icon';
import NotificationDropdown from '../components/NotificationDropdown';
import SettingsDropdown from '../components/SettingsDropdown';
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

    return (<div className="dashboard-shell">
      <aside className="sidebar" aria-label="Điều hướng chính">
        <div className="brand">
          <div className="brand-icon">
            <Icon name="local_parking"/>
          </div>
          <div>
            <h1>Smart Parking AI</h1>
            <p>Hệ thống quản trị</p>
          </div>
        </div>

        <nav className="side-nav">
          {menuItems.map((item) => (<NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end={item.href === ROUTES.HOME} key={item.label} to={item.href}>
              <Icon name={item.icon}/>
              <span>{item.label}</span>
            </NavLink>))}
        </nav>

        <div className="side-footer">
          <a className="nav-link" href="#">
            <Icon name="help"/>
            <span>Hỗ trợ</span>
          </a>
          <a className="nav-link logout" href="#">
            <Icon name="logout"/>
            <span>Đăng xuất</span>
          </a>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <label className="search-box">
            <Icon name="search"/>
            <input placeholder="Tìm kiếm dữ liệu, biển số xe..." type="search"/>
          </label>

          <div className="topbar-actions">
            <NotificationDropdown />
            <SettingsDropdown trigger={<button className="profile-button" type="button">
                  <span>
                    <strong>{user.fullName}</strong>
                    <small>{role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</small>
                  </span>
                  <img alt="User profile" src={user.avatarUrl ?? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=96&q=80'}/>
                </button>}/>
          </div>
        </header>

        <section className="content-area">
          <div className="page-heading">
            <div>
              <h2>Tổng quan hệ thống</h2>
              <p>Hiển thị toàn bộ dữ liệu dashboard theo bộ lọc ngày đã chọn.</p>
              <div className="page-status-row">
                <span>{dateFilterLabel}</span>
                {isLoadingData ? <span className="loading-badge">Đang tải dữ liệu mới...</span> : <span>Đã cập nhật theo ngày chọn.</span>}
              </div>
            </div>
            <div className="heading-actions">
              <div className="date-filter">
                <button className="secondary-button date-selector" type="button" onClick={toggleDateFilter}>
                  <Icon name="calendar_today"/>
                  <span>{dateFilterLabel}</span>
                  <Icon name={dateFilterOpen ? 'expand_less' : 'expand_more'} />
                </button>

                {dateFilterOpen ? (
                  <div className="date-dropdown">
                    <div className="date-presets">
                      {DATE_FILTER_PRESETS.map((preset) => (
                        <button key={preset.key} type="button" className={`preset-button ${selectedFilter === preset.key ? 'active' : ''}`} onClick={() => applyDateFilter(preset.key)}>
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    {(selectedFilter === 'custom' || selectedFilter === 'single') ? (
                      <div className="calendar-panel">
                        <div className="calendar-header">
                          <button type="button" className="nav-button" onClick={() => changeCalendarMonth(-1)}>
                            <Icon name="chevron_left" />
                          </button>
                          <strong>{monthLabel(calendarYear, calendarMonth)}</strong>
                          <button type="button" className="nav-button" onClick={() => changeCalendarMonth(1)}>
                            <Icon name="chevron_right" />
                          </button>
                        </div>
                        <div className="calendar-grid">
                          {WEEK_DAYS.map((day) => (
                            <span key={day} className="calendar-weekday">
                              {day}
                            </span>
                          ))}
                          {getCalendarMatrix(calendarYear, calendarMonth).map((week, weekIndex) => (
                            <Fragment key={weekIndex}>
                              {week.map((day, dayIndex) => {
                                if (!day) {
                                  return <span key={`${weekIndex}-${dayIndex}`} className="calendar-day empty" />;
                                }
                                const current = new Date(calendarYear, calendarMonth, day);
                                const disabled = current > today;
                                const isSelected = selectedFilter === 'custom'
                                  ? isSameDay(current, customStartDate) || isSameDay(current, customEndDate)
                                  : isSameDay(current, selectedDate);
                                const inRange = selectedFilter === 'custom' && isInRange(current, customStartDate, customEndDate);
                                return (
                                  <button
                                    key={`${weekIndex}-${dayIndex}`}
                                    type="button"
                                    className={`calendar-day ${disabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''} ${inRange ? 'in-range' : ''}`}
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
                        {selectedFilter === 'custom' ? (
                          <div className="custom-range-grid">
                            <label>
                              Từ
                              <input type="date" value={formatDateInput(customStartDate)} max={formatDateInput(customEndDate)} onChange={(event) => setCustomStartDate(parseInputDate(event.target.value))} />
                            </label>
                            <label>
                              Đến
                              <input type="date" value={formatDateInput(customEndDate)} min={formatDateInput(customStartDate)} onChange={(event) => setCustomEndDate(parseInputDate(event.target.value))} />
                            </label>
                          </div>
                        ) : null}
                        <div className="calendar-footer">
                          <div className="calendar-summary">
                            {selectedFilter === 'custom'
                              ? `Từ ${formatDisplayDate(customStartDate)} đến ${formatDisplayDate(customEndDate)}`
                              : `Chọn ngày: ${formatDisplayDate(selectedDate)}`}
                          </div>
                          <button className="primary-button apply-button" type="button" onClick={applySelection}>
                            Áp dụng
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <button className="primary-button" type="button" onClick={openReportPreview}>
                <Icon name="download"/>
                Xuất báo cáo
              </button>
            </div>
          </div>

          <section className="metric-grid" aria-label="Chỉ số tổng quan">
            {metricCards.map((metric) => (<article className={`metric-card ${metric.featured ? 'featured' : ''}`} key={metric.label}>
                <div className="metric-top">
                  <div className={`metric-icon ${metric.tone}`}>
                    <Icon name={metric.icon}/>
                  </div>
                  <span className={metric.negative ? 'trend negative' : 'trend'}>{metric.trend}</span>
                </div>
                <p>{metric.label}</p>
                <strong>{metric.value}</strong>
              </article>))}
          </section>

          <section className="analytics-grid">
            <article className="panel traffic-panel">
              <div className="panel-header">
                <h3>
                  Lưu lượng xe 24h qua
                  <Icon name="auto_awesome"/>
                </h3>
                <select aria-label="Chọn bãi xe">
                  <option>Tất cả bãi xe</option>
                  <option>Bãi xe A1</option>
                  <option>Bãi xe B2</option>
                </select>
              </div>
              <div className="bar-chart" aria-label="Biểu đồ lưu lượng xe">
                {dashboardData.chartBars.map((height, index) => (<div className="bar" key={`${height}-${index}`} style={{ height: `${height}%` }}>
                    {index === 0 ? <span>450</span> : null}
                  </div>))}
              </div>
              <div className="chart-times">
                <span>00:00</span>
                <span>04:00</span>
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span>20:00</span>
                <span>23:59</span>
              </div>
            </article>

            <article className="panel vehicle-panel">
              <h3>Phân loại phương tiện</h3>
              <div className="donut-wrap">
                <div className="donut">
                  <div>
                    <strong>{dashboardData.vehicleDistribution.total}</strong>
                    <span>Tổng xe</span>
                  </div>
                </div>
              </div>
              <div className="legend">
                <div>
                  <span className="dot car"/>
                  <p>Ô tô</p>
                  <strong>{dashboardData.vehicleDistribution.car}%</strong>
                </div>
                <div>
                  <span className="dot motorbike"/>
                  <p>Xe máy</p>
                  <strong>{dashboardData.vehicleDistribution.motorbike}%</strong>
                </div>
                <div>
                  <span className="dot electric"/>
                  <p>Xe điện</p>
                  <strong>{dashboardData.vehicleDistribution.electric}%</strong>
                </div>
              </div>
            </article>
          </section>

          <section className="bottom-grid">
            <article className="panel activity-panel">
              <div className="panel-header table-header">
                <h3>Hoạt động gần đây</h3>
                <button type="button">Xem tất cả</button>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Biển số xe</th>
                      <th>Thời gian</th>
                      <th>Loại</th>
                      <th>Vị trí bãi</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.activityRows.map(([plate, time, type, place, status, state]) => (<tr key={`${plate}-${time}`}>
                        <td>{plate}</td>
                        <td>{time}</td>
                        <td>{type}</td>
                        <td>{place}</td>
                        <td>
                          <span className={`status ${state}`}>{status}</span>
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="panel device-panel">
              <h3>Trạng thái thiết bị</h3>
              <div className="device-list">
                {dashboardData.devices.map(([icon, title, subtitle, state]) => (<div className="device-item" key={title}>
                    <div className="device-icon">
                      <Icon name={icon}/>
                    </div>
                    <div>
                      <strong>{title}</strong>
                      <p className={state === 'offline' ? 'danger-text' : ''}>{subtitle}</p>
                    </div>
                    <span className={`signal ${state}`}/>
                  </div>))}
              </div>
              <button className="diagnose-button" type="button" onClick={openSystemDiagnosis}>
                Chẩn đoán hệ thống
              </button>
            </article>
          </section>

          {reportPreviewOpen ? (
            <div className="report-preview-drawer">
              <div className="drawer-backdrop" onClick={closeReportPreview} />
              <div className="drawer-panel report-center">
                <div className="report-header">
                  <div className="report-title-block">
                    <span className="report-tag">Report Center</span>
                    <h2>BÁO CÁO HOẠT ĐỘNG BÃI ĐỖ XE</h2>
                    <p>Phân tích vận hành, chỉ số chính và khuyến nghị AI cho quản lý bãi đỗ xe.</p>
                  </div>
                  <div className="report-meta-block">
                    <div className="report-logo-card">
                      <Icon name="local_parking" />
                      <div>
                        <strong>Smart Parking AI</strong>
                        <span>Enterprise Report</span>
                      </div>
                    </div>
                    <div className="report-meta-grid">
                      <div>
                        <span>Ngày xuất báo cáo</span>
                        <strong>{reportGeneratedAt}</strong>
                      </div>
                      <div>
                        <span>Người xuất</span>
                        <strong>{user.fullName}</strong>
                      </div>
                      <div>
                        <span>Vai trò</span>
                        <strong>{role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</strong>
                      </div>
                      <div>
                        <span>Khoảng thời gian</span>
                        <strong>{dashboardData.label}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <section className="report-summary-grid">
                  <article className="summary-card accent">
                    <div className="summary-card-icon">
                      <Icon name="sync_alt" />
                    </div>
                    <div>
                      <span>Tổng lượt xe ra/vào</span>
                      <strong>{dashboardData.metrics.turnover}</strong>
                    </div>
                    <p>+{dashboardData.metrics.trends.turnover}</p>
                  </article>
                  <article className="summary-card">
                    <div className="summary-card-icon">
                      <Icon name="payments" />
                    </div>
                    <div>
                      <span>Tổng doanh thu</span>
                      <strong>{dashboardData.metrics.revenue}</strong>
                    </div>
                    <p>+{dashboardData.metrics.trends.revenue}</p>
                  </article>
                  <article className="summary-card">
                    <div className="summary-card-icon">
                      <Icon name="insights" />
                    </div>
                    <div>
                      <span>Tỷ lệ lấp đầy</span>
                      <strong>{reportInsights.occupancy}</strong>
                    </div>
                    <p>So với ngày trước</p>
                  </article>
                  <article className="summary-card">
                    <div className="summary-card-icon">
                      <Icon name="event_seat" />
                    </div>
                    <div>
                      <span>Số chỗ còn trống</span>
                      <strong>{dashboardData.metrics.available}</strong>
                    </div>
                    <p>Đang cập nhật theo thời gian thực</p>
                  </article>
                  <article className="summary-card">
                    <div className="summary-card-icon">
                      <Icon name="hardware" />
                    </div>
                    <div>
                      <span>Số sự cố thiết bị</span>
                      <strong>{reportInsights.incidentCount}</strong>
                    </div>
                    <p>Thiết bị cần kiểm tra</p>
                  </article>
                  <article className="summary-card">
                    <div className="summary-card-icon">
                      <Icon name="check_circle" />
                    </div>
                    <div>
                      <span>Tỷ lệ giao dịch thành công</span>
                      <strong>{reportInsights.successRate}</strong>
                    </div>
                    <p>Hoạt động trơn tru</p>
                  </article>
                </section>

                <section className="report-operations-grid">
                  <article className="operation-panel">
                    <h4>Báo cáo vận hành</h4>
                    <div className="operation-grid">
                      <div><span>Tổng số xe</span><strong>{dashboardData.vehicleDistribution.total}</strong></div>
                      <div><span>Xe vào</span><strong>{dashboardData.activityRows.filter((row) => row[2] === 'Vào').length}</strong></div>
                      <div><span>Xe ra</span><strong>{dashboardData.activityRows.filter((row) => row[2] === 'Ra').length}</strong></div>
                      <div><span>Xe đang gửi</span><strong>{dashboardData.activityRows.filter((row) => row[2] === 'Vào' && row[4] !== 'Thành công').length}</strong></div>
                      <div><span>Thời gian gửi trung bình</span><strong>00:12:34</strong></div>
                      <div><span>Giờ cao điểm</span><strong>{reportInsights.peakPeriod}</strong></div>
                    </div>
                  </article>
                  <article className="activity-panel">
                    <div className="panel-header">
                      <h4>Hoạt động gần đây</h4>
                      <span>5 giao dịch mới nhất</span>
                    </div>
                    <div className="activity-table">
                      <div className="table-row table-head">
                        <span>Biển số</span>
                        <span>Thời gian</span>
                        <span>Loại</span>
                        <span>Vị trí</span>
                        <span>Trạng thái</span>
                      </div>
                      {dashboardData.activityRows.slice(0, 6).map((row) => (
                        <div className="table-row" key={row[0]}>
                          <span>{row[0]}</span>
                          <span>{row[1]}</span>
                          <span>{row[2]}</span>
                          <span>{row[3]}</span>
                          <span className={`status-pill ${row[5]}`}>{row[4]}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                  <article className="device-panel">
                    <h4>Trạng thái thiết bị</h4>
                    <div className="device-grid">
                      {dashboardData.devices.map((device) => (
                        <div key={device[1]} className="device-card">
                          <div>
                            <strong>{device[1]}</strong>
                            <span>{device[2]}</span>
                          </div>
                          <span className={`signal ${device[3]}`}></span>
                        </div>
                      ))}
                    </div>
                  </article>
                  <article className="insight-panel">
                    <h4>AI Insight & Khuyến nghị</h4>
                    <ul>
                      <li>Lưu lượng xe tăng 12% so với ngày trước.</li>
                      <li>Khung giờ {reportInsights.peakPeriod} có nguy cơ quá tải.</li>
                      <li>Doanh thu tăng ổn định.</li>
                      <li>Khuyến nghị mở thêm 1 làn xe tại cổng chính.</li>
                    </ul>
                  </article>
                </section>

                <footer className="report-footer">
                  <div>
                    <strong>Smart Parking AI</strong>
                    <span>Report Version 2.0</span>
                  </div>
                  <span>Generated Automatically</span>
                </footer>

                <div className="drawer-actions report-actions">
                  <button className="secondary-button" type="button" onClick={closeReportPreview}>
                    Hủy
                  </button>
                  <button className="primary-button" type="button" disabled={isPreviewLoading} onClick={() => confirmReportExport('PDF')}>
                    {isPreviewLoading ? 'Đang tải...' : 'Tải xuống PDF'}
                  </button>
                  <button className="secondary-button" type="button" disabled={isPreviewLoading} onClick={() => confirmReportExport('Excel')}>
                    {isPreviewLoading ? 'Đang tải...' : 'Tải xuống Excel'}
                  </button>
                  <button className="secondary-button" type="button" onClick={() => window.print()}>
                    In báo cáo
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {diagnosticOpen ? (
            <div className="report-preview-drawer">
              <div className="drawer-backdrop" onClick={closeDiagnosticDrawer} />
              <div className="drawer-panel diagnostic-center">
                <div className="diagnostic-header">
                  <div>
                    <span className="report-tag diagnostic-tag">CHẨN ĐOÁN HỆ THỐNG</span>
                    <h2>Kiểm tra sức khỏe hệ thống Smart Parking AI</h2>
                    <p>Kiểm tra trạng thái hoạt động của toàn bộ thiết bị, dịch vụ và hạ tầng Smart Parking AI.</p>
                  </div>
                  <button type="button" className="icon-button" onClick={closeDiagnosticDrawer}>
                    <Icon name="close" />
                  </button>
                </div>

                {isDiagnosticLoading ? (
                  <div className="diagnostic-loading">
                    <div className="loader-ring" />
                    <p>Đang thực hiện kiểm tra hệ thống...</p>
                  </div>
                ) : (
                  <>
                    <section className="diagnostic-health-grid">
                      <article className="health-card">
                        <div>
                          <span>Health Score</span>
                          <strong>92 / 100</strong>
                          <p className="health-state healthy">🟢 Hoạt động tốt</p>
                        </div>
                        <div className="health-gauge">
                          <div className="gauge-fill" style={{ width: '92%' }} />
                        </div>
                      </article>
                      <article className="health-summary-card">
                        <div>
                          <span>Thời gian kiểm tra</span>
                          <strong>{reportGeneratedAt}</strong>
                        </div>
                        <div>
                          <span>Kiểm tra bởi</span>
                          <strong>{user.fullName}</strong>
                        </div>
                        <div>
                          <span>Vai trò</span>
                          <strong>{role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</strong>
                        </div>
                      </article>
                    </section>

                    <section className="device-check-grid">
                      <article className="device-check-card">
                        <div className="device-check-header">
                          <div>
                            <strong>Camera AI</strong>
                            <span>🟢 Online</span>
                          </div>
                          <Icon name="videocam" />
                        </div>
                        <p>24/24 thiết bị hoạt động</p>
                        <p>OCR Accuracy: 98.4%</p>
                      </article>
                      <article className="device-check-card">
                        <div className="device-check-header">
                          <div>
                            <strong>Barrier</strong>
                            <span>🟢 Online</span>
                          </div>
                          <Icon name="door_front" />
                        </div>
                        <p>8/8 hoạt động</p>
                        <p>Phản hồi bình thường</p>
                      </article>
                      <article className="device-check-card">
                        <div className="device-check-header">
                          <div>
                            <strong>POS</strong>
                            <span>🟡 Cảnh báo</span>
                          </div>
                          <Icon name="point_of_sale" />
                        </div>
                        <p>1 thiết bị bảo trì</p>
                        <p>Kiểm tra PRINTER-03</p>
                      </article>
                      <article className="device-check-card">
                        <div className="device-check-header">
                          <div>
                            <strong>Network</strong>
                            <span>🟢 Ổn định</span>
                          </div>
                          <Icon name="router" />
                        </div>
                        <p>Latency: 12ms</p>
                        <p>API Uptime: 99.98%</p>
                      </article>
                      <article className="device-check-card">
                        <div className="device-check-header">
                          <div>
                            <strong>Server</strong>
                            <span>🟢 Ổn định</span>
                          </div>
                          <Icon name="desktop_windows" />
                        </div>
                        <p>CPU: 42%</p>
                        <p>RAM: 68%</p>
                      </article>
                      <article className="device-check-card">
                        <div className="device-check-header">
                          <div>
                            <strong>Database</strong>
                            <span>🟢 Kết nối thành công</span>
                          </div>
                          <Icon name="storage" />
                        </div>
                        <p>Backup gần nhất: 01:00 AM</p>
                        <p>Response: 18ms</p>
                      </article>
                    </section>

                    <section className="alerts-panel">
                      <div className="panel-header">
                        <h4>Cảnh báo hệ thống</h4>
                        <span>4 vấn đề được phát hiện</span>
                      </div>
                      <ul className="alerts-list">
                        <li>🟡 POS-03 mất kết nối máy in hóa đơn.</li>
                        <li>🟡 Camera Cổng 2 có độ trễ nhận diện cao.</li>
                        <li>🔴 Barrier B3 phản hồi chậm hơn bình thường.</li>
                        <li>🟢 Không phát hiện sự cố nghiêm trọng khác.</li>
                      </ul>
                    </section>

                    <section className="performance-grid">
                      <article className="perf-card">
                        <span>CPU Usage</span>
                        <strong>42%</strong>
                      </article>
                      <article className="perf-card">
                        <span>RAM Usage</span>
                        <strong>68%</strong>
                      </article>
                      <article className="perf-card">
                        <span>Database Response</span>
                        <strong>18ms</strong>
                      </article>
                      <article className="perf-card">
                        <span>Network Latency</span>
                        <strong>12ms</strong>
                      </article>
                      <article className="perf-card">
                        <span>API Uptime</span>
                        <strong>99.98%</strong>
                      </article>
                    </section>

                    <section className="ai-insight-card">
                      <h4>Khuyến nghị AI</h4>
                      <ul>
                        <li>Lưu lượng xe tăng 15% trong 3 ngày gần đây.</li>
                        <li>POS-03 cần kiểm tra trong vòng 24 giờ.</li>
                        <li>Camera Cổng 2 nên được bảo trì định kỳ.</li>
                        <li>Không phát hiện nguy cơ quá tải hệ thống.</li>
                      </ul>
                    </section>

                    <section className="diagnostic-log-panel">
                      <div className="panel-header">
                        <h4>Nhật ký chẩn đoán</h4>
                        <span>Hoạt động gần nhất</span>
                      </div>
                      <div className="diagnostic-log-list">
                        <div>14:20 - Camera AI - Thành công</div>
                        <div>14:20 - Barrier - Thành công</div>
                        <div>14:20 - POS - Cảnh báo</div>
                        <div>14:20 - Network - Thành công</div>
                        <div>14:20 - Database - Thành công</div>
                      </div>
                    </section>
                  </>
                )}

                <div className="drawer-actions report-actions">
                  <button className="secondary-button" type="button" onClick={openSystemDiagnosis}>
                    Chạy lại kiểm tra
                  </button>
                  <button className="primary-button" type="button" disabled={isDiagnosticLoading}>
                    Xuất báo cáo PDF
                  </button>
                  <button className="secondary-button" type="button" disabled={isDiagnosticLoading}>
                    Tải log hệ thống
                  </button>
                  <button className="secondary-button" type="button" onClick={closeDiagnosticDrawer}>
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          ) : null}

        </section>

        <footer className="page-footer">
          <div>
            <a href="#">Điều khoản</a>
            <a href="#">Bảo mật</a>
            <span><i /> Trạng thái hệ thống: Hoạt động</span>
          </div>
        </footer>
      </main>
    </div>);
}
