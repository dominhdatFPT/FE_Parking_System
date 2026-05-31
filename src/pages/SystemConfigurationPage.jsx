import { useEffect, useMemo, useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import './SystemConfigurationPage.css';

const STORAGE_KEY = 'parking_system_configuration';
const DEFAULT_CONFIG = {
  systemName: 'Smart Parking AI',
  region: 'VN',
  timezone: 'Asia/Ho_Chi_Minh',
  defaultLanguage: 'Vietnamese',
  operationMode: 'auto',
  enableCamera: true,
  enableRFID: true,
  enableQR: false,
  enablePaymentGateway: false,
  enableAuditLogs: true,
  sessionTimeout: 15,
  maxConcurrentSessions: 120,
  maintenanceWindow: '02:00 - 04:00',
};

function loadConfig() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return DEFAULT_CONFIG;
  try {
    return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
  }
  catch {
    return DEFAULT_CONFIG;
  }
}

export default function SystemConfigurationPage() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setConfig(loadConfig());
  }, []);

  const enabledIntegrations = useMemo(
    () => [config.enableCamera, config.enableRFID, config.enableQR, config.enablePaymentGateway].filter(Boolean).length,
    [config],
  );

  function handleChange(key, value) {
    setConfig((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setMessage('Đã lưu cấu hình hệ thống thành công.');
  }

  function handleReset() {
    setConfig(DEFAULT_CONFIG);
    window.localStorage.removeItem(STORAGE_KEY);
    setMessage('Đã khôi phục cấu hình mặc định.');
  }

  return (
    <DashboardShell title="Cấu hình hệ thống" description="Thiết lập thông số vận hành, phần cứng và bảo mật chung của Smart Parking AI.">
      <div className="system-config-page">
        <div className="system-config-grid">
          <section className="system-config-card">
            <div className="system-config-card__header">
              <h3>Thông tin hệ thống</h3>
              <p>Điều chỉnh tên, vùng và chế độ vận hành mặc định.</p>
            </div>
            <div className="system-config-form">
              <label>
                Tên hệ thống
                <input type="text" value={config.systemName} onChange={(event) => handleChange('systemName', event.target.value)} />
              </label>
              <label>
                Vùng
                <select value={config.region} onChange={(event) => handleChange('region', event.target.value)}>
                  <option value="VN">Việt Nam</option>
                  <option value="SG">Singapore</option>
                  <option value="US">Hoa Kỳ</option>
                  <option value="DE">Đức</option>
                </select>
              </label>
              <label>
                Múi giờ
                <select value={config.timezone} onChange={(event) => handleChange('timezone', event.target.value)}>
                  <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
                  <option value="Asia/Singapore">Asia/Singapore</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/Berlin">Europe/Berlin</option>
                </select>
              </label>
              <label>
                Ngôn ngữ mặc định
                <select value={config.defaultLanguage} onChange={(event) => handleChange('defaultLanguage', event.target.value)}>
                  <option value="Vietnamese">Tiếng Việt</option>
                  <option value="English">English</option>
                </select>
              </label>
              <label>
                Chế độ vận hành
                <select value={config.operationMode} onChange={(event) => handleChange('operationMode', event.target.value)}>
                  <option value="auto">Tự động</option>
                  <option value="manual">Thủ công</option>
                  <option value="hybrid">Kết hợp</option>
                </select>
              </label>
            </div>
          </section>

          <section className="system-config-card">
            <div className="system-config-card__header">
              <h3>Thiết bị & tích hợp</h3>
              <p>Quản lý phần cứng, camera và kết nối thanh toán.</p>
            </div>
            <div className="system-config-switches">
              <label className="switch-item">
                <span>Camera AI</span>
                <input type="checkbox" checked={config.enableCamera} onChange={(event) => handleChange('enableCamera', event.target.checked)} />
              </label>
              <label className="switch-item">
                <span>RFID Reader</span>
                <input type="checkbox" checked={config.enableRFID} onChange={(event) => handleChange('enableRFID', event.target.checked)} />
              </label>
              <label className="switch-item">
                <span>QR Scanner</span>
                <input type="checkbox" checked={config.enableQR} onChange={(event) => handleChange('enableQR', event.target.checked)} />
              </label>
              <label className="switch-item">
                <span>Payment gateway</span>
                <input type="checkbox" checked={config.enablePaymentGateway} onChange={(event) => handleChange('enablePaymentGateway', event.target.checked)} />
              </label>
            </div>
          </section>

          <section className="system-config-card">
            <div className="system-config-card__header">
              <h3>Bảo mật & vận hành</h3>
              <p>Các thiết lập bảo mật và giới hạn phiên người dùng.</p>
            </div>
            <div className="system-config-form">
              <label>
                Kích hoạt audit logs
                <input type="checkbox" checked={config.enableAuditLogs} onChange={(event) => handleChange('enableAuditLogs', event.target.checked)} />
              </label>
              <label>
                Thời gian timeout (phút)
                <input type="number" min="5" max="120" value={config.sessionTimeout} onChange={(event) => handleChange('sessionTimeout', Number(event.target.value))} />
              </label>
              <label>
                Số lượng phiên đồng thời
                <input type="number" min="10" max="500" value={config.maxConcurrentSessions} onChange={(event) => handleChange('maxConcurrentSessions', Number(event.target.value))} />
              </label>
              <label>
                Cửa sổ bảo trì
                <input type="text" value={config.maintenanceWindow} onChange={(event) => handleChange('maintenanceWindow', event.target.value)} />
              </label>
            </div>
          </section>
        </div>

        <aside className="system-config-sidebar">
          <div className="system-config-card status-card">
            <h4>Trạng thái hiện tại</h4>
            <div className="status-row">
              <strong>{enabledIntegrations}</strong>
              <span>tích hợp đang bật</span>
            </div>
            <div className="status-row">
              <strong>{config.enableAuditLogs ? 'Bật' : 'Tắt'}</strong>
              <span>Audit logs</span>
            </div>
            <div className="status-row">
              <strong>{config.operationMode === 'auto' ? 'Tự động' : config.operationMode === 'manual' ? 'Thủ công' : 'Kết hợp'}</strong>
              <span>Chế độ vận hành</span>
            </div>
          </div>

          <div className="system-config-card note-card">
            <h4>Lưu ý</h4>
            <p>
              Các thay đổi này được áp dụng ngay sau khi bạn nhấn Lưu cấu hình. Vui lòng kiểm tra phần cứng trước khi bật RFID hoặc Payment gateway.
            </p>
          </div>

          <div className="system-config-card actions-card">
            <button className="primary-button" type="button" onClick={handleSave}>
              Lưu cấu hình
            </button>
            <button className="secondary-button" type="button" onClick={handleReset}>
              Khôi phục mặc định
            </button>
            {message ? <p className="save-message">{message}</p> : null}
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
