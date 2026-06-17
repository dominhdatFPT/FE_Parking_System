import React, { useState } from 'react';

const packageCards = {
  PKG1029: {
    customerName: 'Nguyen Minh Anh',
    licensePlate: '51A-248.19',
    vehicleType: 'Car',
    packageType: 'Gói tháng Premium',
    expirationDate: '31/07/2026',
  },
  PKG9999: {
    reason: 'Sai biển số',
  },
  PKG0001: {
    reason: 'Thẻ hết hạn',
  },
  BAD0001: {
    reason: 'Thẻ không tồn tại',
  },
};

const vehicleTypes = ['Motorbike', 'Car'];

function normalize(value) {
  return value.trim().toUpperCase();
}

function nowText() {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-[170px_minmax(0,1fr)] items-center border-b border-slate-100 py-2 last:border-b-0">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="truncate text-sm font-semibold text-slate-950">{value}</span>
    </div>
  );
}

function Badge({ type, children }) {
  const styles = {
    package: 'border-green-200 bg-green-50 text-green-700',
    visitor: 'border-yellow-200 bg-yellow-50 text-yellow-700',
    invalid: 'border-red-200 bg-red-50 text-red-700',
  };

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${styles[type]}`}>
      {children}
    </span>
  );
}

function PackageResult({ result }) {
  return (
    <>
      <InfoRow label="Tên khách hàng" value={result.customerName} />
      <InfoRow label="Biển số đăng ký" value={result.licensePlate} />
      <InfoRow label="Loại xe đăng ký" value={result.vehicleType} />
      <InfoRow label="Loại gói" value={result.packageType} />
      <InfoRow label="Ngày hết hạn" value={result.expirationDate} />
    </>
  );
}

function VisitorResult({ result }) {
  return (
    <>
      <InfoRow label="Mã thẻ vãng lai" value={result.cardCode} />
      <InfoRow label="Biển số" value={result.licensePlate} />
      <InfoRow label="Loại xe" value={result.vehicleType} />
      <InfoRow label="Giờ vào" value={result.entryTime} />
      <InfoRow label="Trạng thái" value={result.sessionStatus} />
    </>
  );
}

function InvalidResult({ result }) {
  return <InfoRow label="Lý do" value={result.reason} />;
}

function ResultConfirmationCard({ resultType, result, canConfirm }) {
  const config = {
    package: {
      badge: <Badge type="package">Thẻ gói hợp lệ</Badge>,
      title: 'Thông tin thẻ gói',
      note: 'Đối chiếu biển số và loại xe thực tế trước khi cho xe vào.',
      noteClassName: 'border-green-200 bg-green-50 text-green-700',
    },
    visitor: {
      badge: <Badge type="visitor">Khách vãng lai</Badge>,
      title: 'Thông tin thẻ vãng lai',
      note: 'Đưa thẻ cho khách trước khi cho xe vào.',
      noteClassName: 'border-yellow-200 bg-yellow-50 text-yellow-700',
    },
    invalid: {
      badge: <Badge type="invalid">Không hợp lệ</Badge>,
      title: 'Chi tiết lỗi',
      note: 'Không cho xe vào. Yêu cầu nhân viên kiểm tra lại thẻ hoặc liên hệ quản trị.',
      noteClassName: 'border-red-200 bg-red-50 text-red-700',
    },
  }[resultType];

  return (
    <div className="w-full max-w-[760px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-slate-950">{config.title}</h2>
        {config.badge}
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 px-4 py-2">
        {resultType === 'package' && <PackageResult result={result} />}
        {resultType === 'visitor' && <VisitorResult result={result} />}
        {resultType === 'invalid' && <InvalidResult result={result} />}
      </div>

      <p className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold leading-6 ${config.noteClassName}`}>
        {config.note}
      </p>

      <button
        type="button"
        disabled={!canConfirm}
        className="mt-4 h-11 w-[240px] rounded-xl bg-yellow-500 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
      >
        XÁC NHẬN CHO XE VÀO
      </button>
    </div>
  );
}

export default function VehicleEntryPage() {
  const [cardCode, setCardCode] = useState('PKG1029');
  const [visitorPlate, setVisitorPlate] = useState('88B-123.45');
  const [visitorType, setVisitorType] = useState('Car');
  const [resultType, setResultType] = useState('visitor');
  const [result, setResult] = useState({
    cardCode: 'VIS1029',
    licensePlate: '88B-123.45',
    vehicleType: 'Car',
    entryTime: nowText(),
    sessionStatus: 'Đã tạo phiên gửi xe',
  });

  function handleCheckCard() {
    const card = packageCards[normalize(cardCode)];

    if (!card || card.reason) {
      setResultType('invalid');
      setResult({
        reason: card?.reason || 'Thẻ không tồn tại',
      });
      return;
    }

    setResultType('package');
    setResult(card);
  }

  function handleCreateVisitorCard() {
    setResultType('visitor');
    setResult({
      cardCode: 'VIS1029',
      licensePlate: normalize(visitorPlate),
      vehicleType: visitorType,
      entryTime: nowText(),
      sessionStatus: 'Đã tạo phiên gửi xe',
    });
  }

  const canConfirm = resultType !== 'invalid';

  return (
    <div className="h-[520px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid h-full grid-cols-[340px_1fr] gap-4">
        <section className="flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h1 className="text-lg font-semibold text-slate-950">Thao tác</h1>

          <div className="mt-4 grid min-h-0 flex-1 grid-rows-2 divide-y divide-slate-200">
            <div className="flex flex-col justify-center space-y-3 pb-4">
              <h2 className="text-sm font-semibold text-slate-700">Kiểm tra thẻ</h2>
              <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                <label className="text-sm font-medium text-slate-500">Mã thẻ</label>
                <input
                  value={cardCode}
                  onChange={(event) => setCardCode(event.target.value.toUpperCase())}
                  className="h-10 w-full max-w-[240px] rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold tracking-wide text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="PKG1029"
                />
              </div>
              <button
                type="button"
                onClick={handleCheckCard}
                className="h-10 w-[170px] rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Kiểm tra thẻ
              </button>
            </div>

            <div className="flex flex-col justify-center space-y-3 pt-4">
              <h2 className="text-sm font-semibold text-slate-700">Tạo thẻ vãng lai</h2>
              <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                <label className="text-sm font-medium text-slate-500">Biển số</label>
                <input
                  value={visitorPlate}
                  onChange={(event) => setVisitorPlate(event.target.value.toUpperCase())}
                  className="h-10 w-full max-w-[240px] rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold tracking-wide text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="88B-123.45"
                />
              </div>
              <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                <label className="text-sm font-medium text-slate-500">Loại xe</label>
                <select
                  value={visitorType}
                  onChange={(event) => setVisitorType(event.target.value)}
                  className="h-10 w-full max-w-[240px] rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  {vehicleTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleCreateVisitorCard}
                className="h-10 w-[170px] rounded-xl bg-yellow-500 text-sm font-semibold text-white shadow-sm transition hover:bg-yellow-600"
              >
                Tạo thẻ vãng lai
              </button>
            </div>
          </div>
        </section>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
          <h1 className="text-lg font-semibold text-slate-950">Kết quả xử lý</h1>

          <div className="mt-4">
            <ResultConfirmationCard resultType={resultType} result={result} canConfirm={canConfirm} />
          </div>
        </section>
      </div>
    </div>
  );
}
