#!/usr/bin/env python3
import os
import re

os.chdir(r'd:\Ki 5\Du an SWP\FE_Parking_System')

# Comprehensive mapping từ CSS className sang Tailwind
replacements = [
    # Dashboard Layout
    ('className="dashboard-shell"', 'className="flex h-screen bg-white"'),
    ('className="sidebar"', 'className="w-64 bg-slate-900 text-white overflow-y-auto flex flex-col"'),
    ('className="brand"', 'className="flex items-center gap-4 p-6 border-b border-slate-700"'),
    ('className="brand-icon"', 'className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-xl text-white"'),
    ('className="side-nav"', 'className="flex-1 py-6 space-y-1 overflow-y-auto"'),
    ('className="side-footer"', 'className="border-t border-slate-700 py-4 px-4 space-y-2"'),
    ('className="main-content"', 'className="flex-1 flex flex-col overflow-hidden"'),
    
    # Topbar
    ('className="topbar"', 'className="flex items-center justify-between gap-6 px-8 py-4 border-b border-gray-200 bg-white"'),
    ('className="search-box"', 'className="flex items-center gap-2 flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-600 hover:border-gray-400 transition-colors"'),
    ('className="topbar-actions"', 'className="flex items-center gap-4"'),
    ('className="profile-button"', 'className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300 bg-white"'),
    
    # Content Area
    ('className="content-area"', 'className="flex-1 overflow-y-auto bg-slate-50 p-8"'),
    ('className="page-heading"', 'className="flex justify-between gap-8 mb-8"'),
    ('className="page-status-row"', 'className="flex gap-6 items-center mt-4 text-sm text-gray-600"'),
    ('className="loading-badge"', 'className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"'),
    ('className="heading-actions"', 'className="flex flex-col gap-4 items-end"'),
    
    # Date Filter
    ('className="date-filter"', 'className="relative"'),
    ('className="secondary-button date-selector"', 'className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-semibold"'),
    ('className="date-dropdown"', 'className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 w-96"'),
    ('className="date-presets"', 'className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-gray-200"'),
    ('className="preset-button"', 'className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm hover:bg-gray-50 transition-colors"'),
    ('className="calendar-panel"', 'className="border-t border-gray-200 pt-4 mt-4"'),
    ('className="calendar-header"', 'className="flex justify-between items-center mb-4 px-2"'),
    ('className="nav-button"', 'className="p-2 rounded hover:bg-gray-100 transition-colors"'),
    ('className="calendar-grid"', 'className="grid grid-cols-7 gap-2 mb-4 px-2"'),
    ('className="calendar-weekday"', 'className="text-center text-xs font-bold text-gray-600 py-2"'),
    ('className="calendar-day empty"', 'className="aspect-square"'),
    ('className="custom-range-grid"', 'className="grid grid-cols-2 gap-4 py-4 px-2 border-t border-gray-200 mt-4"'),
    ('className="calendar-footer"', 'className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 gap-4"'),
    ('className="calendar-summary"', 'className="text-sm text-gray-600"'),
    ('className="primary-button apply-button"', 'className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"'),
    
    # Buttons
    ('className="primary-button"', 'className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"'),
    ('className="secondary-button"', 'className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-semibold"'),
    
    # Metrics & Cards
    ('className="metric-grid"', 'className="grid grid-cols-4 gap-4 mb-8"'),
    ('className="metric-top"', 'className="flex justify-between items-start mb-4"'),
    ('className="metric-card featured"', 'className="p-6 rounded-2xl bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)] ring-2 ring-blue-500"'),
    ('className="metric-card"', 'className="p-6 rounded-2xl bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]"'),
    
    # Analytics Grid
    ('className="analytics-grid"', 'className="grid grid-cols-2 gap-8 mb-8"'),
    ('className="panel traffic-panel"', 'className="p-6 bg-white rounded-2xl shadow-[0_10px_28px_rgba(15,23,42,0.05)]"'),
    ('className="panel vehicle-panel"', 'className="p-6 bg-white rounded-2xl shadow-[0_10px_28px_rgba(15,23,42,0.05)]"'),
    ('className="panel activity-panel"', 'className="p-6 bg-white rounded-2xl shadow-[0_10px_28px_rgba(15,23,42,0.05)]"'),
    ('className="panel device-panel"', 'className="p-6 bg-white rounded-2xl shadow-[0_10px_28px_rgba(15,23,42,0.05)]"'),
    ('className="panel"', 'className="p-6 bg-white rounded-2xl shadow-[0_10px_28px_rgba(15,23,42,0.05)]"'),
    ('className="panel-header"', 'className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200"'),
    ('className="panel-header table-header"', 'className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200"'),
    
    # Tables
    ('className="table-scroll"', 'className="overflow-x-auto"'),
    
    # Charts & Legends
    ('className="bar-chart"', 'className="flex items-end justify-center gap-1 h-64"'),
    ('className="bar"', 'className="flex-1 bg-blue-600 rounded-t hover:bg-blue-700 transition-colors relative flex items-start justify-center"'),
    ('className="chart-times"', 'className="flex justify-between text-xs text-gray-600 mt-4 px-2"'),
    ('className="legend"', 'className="grid grid-cols-3 gap-4 mt-6"'),
    ('className="dot car"', 'className="w-3 h-3 rounded-full bg-blue-600"'),
    ('className="dot motorbike"', 'className="w-3 h-3 rounded-full bg-green-600"'),
    ('className="dot electric"', 'className="w-3 h-3 rounded-full bg-purple-600"'),
    ('className="donut-wrap"', 'className="flex justify-center items-center h-48"'),
    ('className="donut"', 'className="w-32 h-32 rounded-full border-8 border-blue-600 flex items-center justify-center"'),
    
    # Bottom Grid
    ('className="bottom-grid"', 'className="grid grid-cols-2 gap-8"'),
    
    # Devices
    ('className="device-list"', 'className="space-y-4"'),
    ('className="device-item"', 'className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"'),
    ('className="device-icon"', 'className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"'),
    ('className="danger-text"', 'className="text-red-600"'),
    ('className="signal"', 'className="w-2.5 h-2.5 rounded-full ml-auto"'),
    
    # Report Drawer
    ('className="report-preview-drawer"', 'className="fixed inset-0 z-50 flex"'),
    ('className="drawer-backdrop"', 'className="absolute inset-0 bg-black/50"'),
    ('className="drawer-panel report-center"', 'className="relative ml-auto w-full max-w-2xl bg-white overflow-y-auto"'),
    ('className="report-header"', 'className="grid grid-cols-[1fr_1.5fr] gap-8 p-8 border-b border-gray-200"'),
    ('className="report-title-block"', 'className="space-y-4"'),
    ('className="report-tag"', 'className="text-xs font-bold text-blue-600 uppercase tracking-wide"'),
    ('className="report-meta-block"', 'className="space-y-6"'),
    ('className="report-logo-card"', 'className="flex items-center gap-4 p-4 rounded-lg bg-gray-50"'),
    ('className="report-meta-grid"', 'className="grid grid-cols-2 gap-4"'),
    ('className="report-summary-grid"', 'className="grid grid-cols-3 gap-4 px-8 py-8 border-b border-gray-200"'),
    ('className="summary-card accent"', 'className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-600"'),
    ('className="summary-card"', 'className="p-4 rounded-lg bg-gray-50"'),
    ('className="summary-card-icon"', 'className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2"'),
    ('className="report-operations-grid"', 'className="grid grid-cols-2 gap-8 px-8 py-8 border-b border-gray-200"'),
    ('className="operation-panel"', 'className="p-6 rounded-lg bg-gray-50"'),
    ('className="operation-grid"', 'className="grid grid-cols-3 gap-4 mt-6"'),
    ('className="activity-panel"', 'className="p-6 rounded-lg bg-gray-50"'),
    ('className="activity-table"', 'className="space-y-0"'),
    ('className="table-row table-head"', 'className="grid grid-cols-5 gap-4 p-3 bg-gray-200 font-bold text-sm rounded-t"'),
    ('className="table-row"', 'className="grid grid-cols-5 gap-4 p-3 border-b border-gray-200 hover:bg-gray-100"'),
    ('className="report-footer"', 'className="flex justify-between items-center px-8 py-6 border-t border-gray-200"'),
    ('className="report-preview-footer"', 'className="bg-gray-50 p-4"'),
    
    # Navigation
    ('className="status"', 'className="px-2 py-1 rounded text-xs font-semibold"'),
    ('className="status success"', 'className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700"'),
    ('className="status warning"', 'className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700"'),
    ('className="status error"', 'className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700"'),
    ('className="status offline"', 'className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-700"'),
    
    # Diagnosis Drawer
    ('className="diagnosis-drawer"', 'className="fixed inset-0 z-50 flex"'),
]

files_to_process = [
    'src/pages/HomePage.jsx',
    'src/pages/AuditLogPage.jsx',
    'src/pages/SystemConfigurationPage.jsx',
]

for file_path in files_to_process:
    if not os.path.exists(file_path):
        print(f"⚠ {file_path} not found")
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    for old, new in replacements:
        content = content.replace(old, new)
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ {file_path} updated")
    else:
        print(f"ℹ {file_path} has no CSS classes to replace")

print("\n✅ Tailwind conversion complete!")
