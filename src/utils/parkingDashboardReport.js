function parseNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const source = String(value ?? '');
  const compactUnit = /(triệu|trieu|nghìn|nghin|[mk])/i.test(source);
  const cleaned = source.replace(/[^\d,.-]/g, '');
  const normalized = compactUnit
    ? cleaned.replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.')
    : cleaned.replace(/[^\d-]/g, '');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function parseCompactMoney(value) {
  const text = String(value ?? '').trim().toUpperCase();
  const number = parseNumber(text);
  if (text.includes('TRIỆU') || text.includes('TRIEU')) return number * 1000000;
  if (text.includes('NGHÌN') || text.includes('NGHIN')) return number * 1000;
  if (text.includes('M')) return number * 1000000;
  if (text.includes('K')) return number * 1000;
  return number;
}

function formatRevenueLabel(value) {
  const amount = parseCompactMoney(value);
  if (amount >= 1000000) {
    return `${(amount / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} triệu`;
  }
  return amount.toLocaleString('vi-VN');
}

function parseCapacity(capacity) {
  const [usedRaw, totalRaw] = String(capacity ?? '').split('/');
  return {
    used: parseNumber(usedRaw),
    total: parseNumber(totalRaw),
  };
}

function safeSheetName(name) {
  return String(name).replace(/[\\/?*[\]:]/g, '').slice(0, 31) || 'Bao cao';
}

function formatDateLabel(dateValue) {
  if (!dateValue) return '';
  const [year, month, day] = String(dateValue).split('-');
  if (!year || !month || !day) return String(dateValue);
  return `${day}/${month}/${year}`;
}

function setBorder(cell, color = 'D9E2F3') {
  cell.border = {
    top: { style: 'thin', color: { argb: color } },
    left: { style: 'thin', color: { argb: color } },
    bottom: { style: 'thin', color: { argb: color } },
    right: { style: 'thin', color: { argb: color } },
  };
}

function styleRange(worksheet, range, style) {
  const [start, end] = range.split(':');
  const startCell = worksheet.getCell(start);
  const endCell = worksheet.getCell(end);

  for (let row = startCell.row; row <= endCell.row; row += 1) {
    for (let col = startCell.col; col <= endCell.col; col += 1) {
      const cell = worksheet.getCell(row, col);
      Object.assign(cell, style);
    }
  }
}

function addKpiCard(worksheet, range, label, value, fillColor, fontColor = '0F3A69') {
  const [start, end] = range.split(':');
  worksheet.mergeCells(range);
  const cell = worksheet.getCell(start);
  cell.value = {
    richText: [
      { text: `${label}\n`, font: { size: 10, color: { argb: '44546A' } } },
      { text: value, font: { size: 18, bold: true, color: { argb: fontColor } } },
    ],
  };
  cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
  setBorder(cell, 'C9D6EA');
}

function addSectionTitle(worksheet, row, title) {
  worksheet.mergeCells(`B${row}:H${row}`);
  const cell = worksheet.getCell(`B${row}`);
  cell.value = title;
  cell.font = { bold: true, size: 12, color: { argb: '0F3A69' } };
  cell.alignment = { vertical: 'middle', horizontal: 'left' };
}

function addTable(worksheet, startRow, headers, rows, totals = null) {
  const startCol = 2;
  const headerRow = worksheet.getRow(startRow);

  headers.forEach((header, index) => {
    const cell = headerRow.getCell(startCol + index);
    cell.value = header;
    cell.font = { bold: true, color: { argb: 'FFFFFF' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2F5597' } };
    setBorder(cell, 'B4C6E7');
  });

  rows.forEach((rowData, rowIndex) => {
    const row = worksheet.getRow(startRow + 1 + rowIndex);
    rowData.forEach((value, colIndex) => {
      const cell = row.getCell(startCol + colIndex);
      cell.value = value;
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: rowIndex % 2 === 0 ? 'FFFFFF' : 'F2F2F2' },
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: typeof value === 'number' ? 'right' : 'left',
      };
      if (typeof value === 'number') cell.numFmt = '#,##0';
      setBorder(cell, 'D9E2F3');
    });
  });

  const totalRowNumber = startRow + rows.length + 1;
  if (totals) {
    const totalRow = worksheet.getRow(totalRowNumber);
    totals.forEach((value, index) => {
      const cell = totalRow.getCell(startCol + index);
      cell.value = value;
      cell.font = { bold: true, color: { argb: '0F3A69' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E2F0D9' } };
      cell.alignment = {
        vertical: 'middle',
        horizontal: typeof value === 'number' ? 'right' : 'left',
      };
      if (typeof value === 'number') cell.numFmt = '#,##0';
      setBorder(cell, 'D9E2F3');
    });
  }

  return totals ? totalRowNumber + 2 : startRow + rows.length + 2;
}

function sessionRows(sessions, completed = false) {
  return sessions.map((session, index) => [
    index + 1,
    session.plate,
    session.type,
    session.customer,
    session.entry,
    session.exit,
    session.duration,
    completed ? parseCompactMoney(session.fee) : session.status,
    completed ? session.payment : session.zone,
  ]);
}

export async function exportParkingDashboardReport({ data, selectedDate }) {
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Smart Parking System';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(safeSheetName('Bao cao tong quan bai'), {
    views: [{ showGridLines: true }],
  });

  worksheet.columns = [
    { width: 4 },
    { width: 19 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
  ];

  worksheet.mergeCells('B2:I2');
  worksheet.getCell('B2').value = 'BÁO CÁO TỔNG QUAN BÃI - SMART PARKING SYSTEM';
  worksheet.getCell('B2').font = { bold: true, size: 16, color: { argb: '0F3A69' } };
  worksheet.getCell('B2').alignment = { vertical: 'middle', horizontal: 'left' };

  worksheet.mergeCells('B3:I3');
  worksheet.getCell('B3').value = 'Báo cáo được xuất từ trang Tổng quan bãi theo dữ liệu đang hiển thị trong hệ thống.';
  worksheet.getCell('B3').font = { italic: true, size: 10, color: { argb: '666666' } };

  worksheet.getCell('B5').value = 'Ngày báo cáo';
  worksheet.getCell('C5').value = formatDateLabel(selectedDate);
  worksheet.getCell('E5').value = 'Bãi/Khu vực';
  worksheet.getCell('F5').value = 'Tất cả';
  worksheet.getCell('H5').value = 'Thời điểm xuất';
  worksheet.getCell('I5').value = new Date();
  worksheet.getCell('I5').numFmt = 'dd/mm/yyyy hh:mm';

  ['B5', 'E5', 'H5'].forEach((address) => {
    worksheet.getCell(address).font = { color: { argb: '44546A' } };
  });
  ['C5', 'F5', 'I5'].forEach((address) => {
    worksheet.getCell(address).font = { color: { argb: '0000FF' } };
  });

  const capacity = parseCapacity(data.capacity);
  const totalRevenue = data.revenueBreakdown?.find((item) => item.label.includes('Tổng'))?.value
    || data.revenueBreakdown?.[0]?.value
    || data.revenue;
  const subscriptionRevenue = data.revenueBreakdown?.find((item) => item.label.includes('gói'))?.value || 0;
  const visitorRevenue = data.revenueBreakdown?.find((item) => item.label.includes('vãng lai'))?.value || 0;
  const revenue = parseCompactMoney(totalRevenue);
  const subscriptionRevenueValue = parseCompactMoney(subscriptionRevenue);
  const visitorRevenueValue = parseCompactMoney(visitorRevenue);

  addKpiCard(worksheet, 'B7:C8', '🚗 Lượt xe vào', String(data.entries), 'D9EAF7');
  addKpiCard(worksheet, 'D7:E8', '🚙 Lượt xe ra', String(data.exits), 'FFF2CC', 'BF9000');
  addKpiCard(worksheet, 'F7:G8', '💰 Doanh thu', formatRevenueLabel(totalRevenue), 'E2F0D9', '00875A');
  addKpiCard(worksheet, 'H7:I8', '🅿️ Công suất bãi', `${capacity.used} / ${capacity.total}`, 'EDEDED');

  addSectionTitle(worksheet, 11, 'CHI TIẾT CHỈ SỐ VẬN HÀNH');
  let nextRow = addTable(
    worksheet,
    12,
    ['Chỉ số', 'Giá trị', 'Ghi chú'],
    [
      ['Xe vào', data.entries, 'Lượt vào trong ngày'],
      ['Xe ra', data.exits, 'Lượt ra trong ngày'],
      ['Doanh thu', revenue, 'Tổng doanh thu đã ghi nhận'],
      ['Doanh thu xe gói', subscriptionRevenueValue, 'Doanh thu từ đăng ký gói/thẻ tháng'],
      ['Doanh thu xe vãng lai', visitorRevenueValue, 'Doanh thu từ lượt gửi xe vãng lai'],
      ['Đang sử dụng', capacity.used, 'Số xe trong bãi'],
      ['Tổng sức chứa', capacity.total, 'Tổng slot'],
      ['Còn trống', Number(data.availableSlots || 0), 'Slot khả dụng'],
    ],
    ['TỔNG QUAN', '', ''],
  );

  addSectionTitle(worksheet, nextRow, 'PHIÊN ĐANG HOẠT ĐỘNG');
  nextRow = addTable(
    worksheet,
    nextRow + 1,
    ['STT', 'Biển số', 'Loại xe', 'Khách', 'Giờ vào', 'Giờ ra', 'Thời lượng', 'Trạng thái', 'Khu'],
    sessionRows(data.sessions || [], false),
  );

  addSectionTitle(worksheet, nextRow, 'PHIÊN GẦN ĐÂY');
  const completedRows = sessionRows(data.completedSessions || [], true);
  const completedRevenue = completedRows.reduce((sum, row) => sum + (typeof row[7] === 'number' ? row[7] : 0), 0);
  addTable(
    worksheet,
    nextRow + 1,
    ['STT', 'Biển số', 'Loại xe', 'Khách', 'Giờ vào', 'Giờ ra', 'Thời lượng', 'Phí', 'Thanh toán'],
    completedRows,
    ['TỔNG', '', '', '', '', '', '', completedRevenue, ''],
  );

  worksheet.eachRow((row) => {
    row.height = Math.max(row.height || 18, 20);
    row.eachCell((cell) => {
      cell.font = cell.font || { size: 10, color: { argb: '1F2937' } };
      cell.alignment = cell.alignment || { vertical: 'middle' };
    });
  });

  styleRange(worksheet, 'B2:I2', {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } },
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bao-cao-tong-quan-bai-${selectedDate || 'hom-nay'}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
