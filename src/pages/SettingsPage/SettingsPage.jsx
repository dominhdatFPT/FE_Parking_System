import { useMemo } from 'react';
import { useParams } from 'react-router';
import DashboardShell from '../../components/DashboardShell';
import { SETTINGS_SECTIONS } from '../../features/settings/config';
export default function SettingsPage() {
    const { section } = useParams();
    const data = useMemo(() => (section ? SETTINGS_SECTIONS[section] : undefined), [section]);
    return (<DashboardShell title={data?.title ?? 'Cài đặt'} description={data?.description ?? 'Chọn một mục cấu hình để bắt đầu.'}>
      <div className="panel settings-page-panel">
        {data ? (<>
            <div className="settings-page-header">
              <h3>{data.title}</h3>
              <p>{data.description}</p>
            </div>
            <div className="settings-page-body">
              <p>{data.content}</p>
              <div className="settings-page-actions">
                <button className="primary-button" type="button">
                  Mở mục cài đặt
                </button>
              </div>
            </div>
          </>) : (<div className="settings-page-empty">
            <h3>Chưa có mục</h3>
            <p>Vui lòng chọn một mục cài đặt từ menu Settings.</p>
          </div>)}
      </div>
    </DashboardShell>);
}
